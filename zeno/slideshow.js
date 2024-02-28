const chalk = require('chalk');
const Zeno = require("./zeno.js");
const split = require("./utils.js").splitTextBySections;
const interlace = require("./utils.js").interlace_strings;

/**
 * @param {Zeno} zeno
 * @param {string} sections
 */
async function slideshow(zeno, sections) {

	const stdin = process.stdin;
	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	sections = split(sections);

	const printSnapshot = (snapshot) => {
		console.clear();
		console.log(`Snapshot #${currentStack + 1} / ${zeno.zaps.length}\n`);
		const combineColors = (color1, color2) => (txt) => color1(color2(txt));
		const currSection = snapshot.section;
		const stack = snapshot.snapshotData;
		let spaceCount= 0;
		let calls = 0;
		const code = [];
		for (let idx in sections) {
			let { section, text } = sections[idx];
			const startingSpaces = text.match(/^\s*/)[0].length;
			const newLines = '\n'.repeat(text.match(/\n*$/)[0].length);
			const sectionColor = section === currSection 
				? combineColors(chalk.bgGreen, chalk.black)
				: stack.some(s => s.get(Zeno.SOURCE_SECTIONS).includes(section))
				? combineColors(chalk.bgYellow, chalk.black)
				: chalk.white;
			text = ' '.repeat(startingSpaces * 5) + sectionColor(text.trim());
			code.push({ section, text, newLines });
		}
		for (let i = stack.length - 1; i >= 0; i--) {
			if (stack[i].get(Zeno.SCOPE_TYPE) !== Zeno.FUNCTION) {
				continue;
			}
			const idx = code.findIndex(s => stack[i].get(Zeno.SOURCE_SECTIONS).includes(s.section));
			code[idx].text = code[idx].text + chalk.yellow(' {' + ++calls + '}');
		}
		const codeText = code.map(s => s.text + s.newLines).join('');
		
		let stackData=  "";
		for (const scope of stack) {
			let spaces = ' '.repeat(spaceCount);
			const scopeType = scope.get(Zeno.SCOPE_TYPE);
			const scopeName = scope.get(Zeno.SCOPE_NAME);
			const stackColor = ['FUNCTION', 'MAIN'].includes(scopeType) ? chalk.green : chalk.blue;
			stackData += spaces + stackColor(`+-+ ${scopeName}`);
			if (["FUNCTION", "BLOCK"].includes(scopeType)) {
				stackData += stackColor(` [ ${scopeType.toLowerCase()} scope ]`);
			}
			stackData += '\n';
			spaceCount += 2;
			for (let [key, value] of scope) {
				value = JSON.stringify(value);
				if (key.startsWith('[[')) {
					continue;
				}
				key = key.startsWith('%') ? chalk.yellow(key) : key;
				stackData += `${' '.repeat(spaceCount)}| ${key}: ${value}\n`;
			}
		}

		process.stdout.write(interlace(codeText, stackData, 60, 70) + '\n');
	};

	const processKey = (key) => {
		if (key === '\u0003') {
			process.exit();
		}
		if (key === '-') {
			currentStack = currentStack <= 0 ? 1 : currentStack;
			return printSnapshot(zeno.zaps[--currentStack]);
		}
		if (key === '=') {
			currentStack = currentStack < zeno.zaps.length - 1 ? currentStack + 1 : currentStack;
			return printSnapshot(zeno.zaps[currentStack]);
		}
	};

	var currentStack = -1;

	stdin.on('data', processKey);

	printSnapshot(zeno.zaps[++currentStack]);
}

module.exports = slideshow;
