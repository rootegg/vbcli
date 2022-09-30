#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const chalk = require("chalk");
const ora = require("ora");
const downgit = require("download-git-repo");
const inquirer = require("inquirer");
var nodeCmd = require("node-cmd");
const pkg = require("./package.json");
const fs = require("fs");

program.name("vbcli").usage("create/registry");
// 定义命令 vbcli create，下载vue/react模板
program
  .command("create")
  .description("【选择】下载模板vue或react，无参数")
  .action(async function () {
    const existFiles = fs.readdirSync("./");
    if (existFiles.length) {
      return console.log(chalk.red("失败，请在空目录下执行命令"));
    }

    console.log(chalk.yellow("注意在cmd中打开才能选择："));
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "branch",
        message: "下载模板",
        choices: ["vue", "react", "library"],
      },
    ]);

    const spinner = ora("下载中").start();
    downgit(
      `github:rootegg/vbtemplate#${answer.branch}`,
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
// 设置的npm源
program
  .command("registry")
  .description("【选择】设置npmjs或淘宝源，无参数")
  .action(async function () {
    console.log(chalk.yellow("注意在cmd中打开才能选择："));
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "source",
        message: "设置全局源",
        choices: [
          "https://registry.npmjs.org",
          "https://registry.npm.taobao.org",
        ],
      },
    ]);
    nodeCmd.runSync(`npm config set registry ${answer.source}`);
    console.log(chalk.green("设置成功"));
  });
// 定义版本
program.version(pkg.version);
// 绑定解析
program.parse();
