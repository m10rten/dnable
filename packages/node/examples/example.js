const { toDNA, toText, toRNA } = require("../dist/index.js");

(async () => {
	console.time("toDNA");

	const text = "Hi how are you?";
	const dna = await toDNA(text); // ACGT...
	console.log(dna);
	const revert = await toText(dna); // Hi how are you?
	console.log(revert);

	const obj = {
		a: 1,
		b: 2,
		c: 3,
	};
	const objDna = await toDNA(JSON.stringify(obj)); // ACGT...
	const objRevert = await toText(objDna); // {"a":1,"b":2,"c":3}
	console.log(objRevert);

	const rnaTest = "Hi how are you?";
	const rna = await toRNA(rnaTest); // ACGU...
	const reverted = await toText(rna); // Hi how are you?
	console.log(reverted);
	console.timeEnd("toDNA");
})();
