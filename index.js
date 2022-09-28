#!/usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const downgit = require("download-git-repo");
const pkg = require("./package.json");
const fs = require("fs");

// 定义命令 vbcli create
commander.command("create").action(function () {
  const existFiles = fs.readdirSync("./");
  if (existFiles.length) {
    return console.log(chalk.red("失败，请在空目录下执行命令"));
  }

  const spinner = ora("下载中").start();
  downgit(
    "github:rootegg/vbtemplate",
    process.cwd(),
    { clone: false },
    function (err) {
      spinner.stop();
      if (err) {
        throw err;
      }
      console.log(chalk.green("下载成功"));
    }
  );
});
// 定义版本
commander.version(pkg.version);
// 绑定解析
commander.parse(process.argv);
