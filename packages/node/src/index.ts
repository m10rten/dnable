const DNA = ["A", "C", "G", "T"] as const;
type DNA = typeof DNA[number];
const DNABits = ["00", "01", "10", "11"] as const;
type DNABits = typeof DNABits[number];

type BinaryOpts = 0 | 1;
type Byte = `${BinaryOpts}${BinaryOpts}${BinaryOpts}${BinaryOpts}${BinaryOpts}${BinaryOpts}${BinaryOpts}${BinaryOpts}`;

async function toBinary(str: string): Promise<string> {
	const res: Byte[] = [];
	for (const c of str) {
		const binary = c.charCodeAt(0).toString(2);
		res.push(binary.padStart(8, "0") as Byte);
	}
	return res.join(" ");
}

async function binaryToText(bytes: string) {
	const split = bytes.split(" ");
	const res = [];
	for (const c of split) {
		const num = parseInt(c, 2);
		res.push(String.fromCharCode(num));
	}
	return res.join("");
}

const getBit = (dna: DNA): DNABits => {
	switch (dna) {
		case "A":
			return "00";
		case "C":
			return "01";
		case "G":
			return "10";
		case "T":
			return "11";
		default:
			throw new Error("Invalid DNA");
	}
};

const getDNA = (bit: DNABits): DNA => {
	switch (bit) {
		case "00":
			return "A";
		case "01":
			return "C";
		case "10":
			return "G";
		case "11":
			return "T";
		default:
			throw new Error("Invalid bits");
	}
};

async function BinaryToDNA(str: string): Promise<DNA[]> {
	// split string in spaces
	const split = str.split(" ");
	const res: DNA[] = [];
	for (const c of split) {
		// split string in sets of 2
		const set = c.match(/.{1,2}/g);
		if (!set) throw new Error("binary string is not divided in bytes.");
		for (const s of set) {
			const dna = getDNA(s as DNABits);
			res.push(dna);
		}
	}
	return res;
}

async function DNAToBinary(str: string): Promise<string> {
	// split the string in sets of 4 characters (AAAA eg) = 1 byte
	const match = str.match(/.{1,4}/g);
	if (!match) throw new Error("DNA string is not divided in bytes.");

	const res = [];
	for (const m of match) {
		const set = [];
		for (const c of m) {
			const binary = getBit(c as DNA);
			set.push(binary);
		}
		const joined = set.join("");
		res.push(joined);
	}

	return res.join(" ");
}

export async function toText(str: string): Promise<string> {
	const binary = await DNAToBinary(str);
	const text = await binaryToText(binary);
	return text;
}

export async function toDNA(str: string): Promise<string> {
	const chars = str.split("");
	const res: DNA[] = [];
	for (const c of chars) {
		const binary = await toBinary(c);
		const dna = await BinaryToDNA(binary);
		res.push(...dna);
	}
	return res.join("");
}
