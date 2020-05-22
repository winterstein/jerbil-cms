#!/usr/bin/env node
const shell = require("shelljs");
const https = require('https');
const fs = require('fs');

const jar = 'jerbil-all.jar';
const cmd = 'jerbil';

let jarFile;
// Can we store the jar in a sort of canonical place? ~/bin
// https://unix.stackexchange.com/posts/36874/revisions
if (process.env.HOME && fs.existsSync(process.env.HOME)) {
	let jardir = process.env.HOME+'/bin';
	if ( ! fs.existsSync(jardir)) {
		fs.mkdirSync(jardir);
	}
	jarFile = jardir+"/"+jar;
} else {
	jarFile = jar;
}

//console.log(process.argv);
const args = [...process.argv];
// shidt node command, script path
args.shift();	
const dirPath = args.shift();

const ocmd = "java -jar "+jarFile+" "+args.join(" ");

const jarExists = fs.existsSync(jarFile);

if ( ! jarExists || args[0]==="-update" || args[0]==="--update") {
	console.log("Downloading latest "+jar+"...");
	// cross-platform download -- sadly not as 100% reliable as wget
	const file = fs.createWriteStream(jarFile);
	const request = https.get("https://www.winterwell.com/software/downloads/"+jar, function(response) {
		  let rp = response.pipe(file);
		  // TODO process the pipe and detect "all done"
		//   console.log("...Download complete. "+Object.keys(rp));
		//   if (args[0]==="-update" || args[0]==="--update") {
			// dont go on to build a site
		return;
		// }
		// // do it
		// console.log(ocmd);
		// shell.exec(ocmd);
		// return;
	});
	console.log("Note: If you get a message 'Invalid or corrupt jarfile' - Try re-running "+cmd+" -update to download the jar again.");
	return;
} else {

	// do it now
	console.log(ocmd);
	shell.exec(ocmd);
};
