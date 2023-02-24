const DNA = ["A", "C", "G", "T"] as const;
const RNA = ["A", "C", "G", "U"] as const;
const Bits = ["00", "01", "10", "11"] as const;

export type DNA = typeof DNA[number];
export type RNA = typeof RNA[number];
export type Bits = typeof Bits[number];

enum Codex {
	A = "00",
	C = "01",
	G = "10",
	T = "11",
	U = "01",
}
const CideDNA = {
	"00": "A",
	"01": "C",
	"10": "G",
	"11": "T",
} as const;
const CideRNA = {
	"00": "A",
	"01": "C",
	"10": "G",
	"11": "U",
} as const;

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

const getBit = (code: DNA | RNA): Bits => {
	switch (code) {
		case "A":
			return Codex.A;
		case "C":
			return Codex.C;
		case "G":
			return Codex.G;
		case "T":
			return Codex.T;
		case "U":
			return Codex.U;
		default:
			throw new Error("Invalid DNA");
	}
};

const getDNA = (bit: Bits): DNA => {
	switch (bit) {
		case "00":
			return CideDNA["00"];
		case "01":
			return CideDNA["01"];
		case "10":
			return CideDNA["10"];
		case "11":
			return CideDNA["11"];
		default:
			throw new Error("Invalid bits");
	}
};

const getRNA = (bit: Bits): RNA => {
	switch (bit) {
		case "00":
			return CideRNA["00"];
		case "01":
			return CideRNA["01"];
		case "10":
			return CideRNA["10"];
		case "11":
			return CideRNA["11"];
		default:
			throw new Error("Invalid RNA");
	}
};

async function BinaryTo(str: string, type: "rna" | "dna"): Promise<Array<string>> {
	// split string in spaces
	const split = str.split(" ");
	const res = [];
	for (const c of split) {
		// split string in sets of 2
		const set = c.match(/.{1,2}/g);
		if (!set) throw new Error("binary string is not divided in bytes.");
		for (const s of set) {
			const code = type === "dna" ? getDNA(s as Bits) : getRNA(s as Bits);
			res.push(code as DNA | RNA);
		}
	}
	return res;
}

async function convertToBinary(str: string): Promise<string> {
	// split the string in sets of 4 characters (AAAA eg) = 1 byte
	const match = str.match(/.{1,4}/g);
	if (!match) throw new Error("DNA string is not divided in bytes.");

	const res: Byte[] = [];
	for (const m of match) {
		const set: Bits[] = [];
		for (const c of m) {
			const binary: Bits = getBit(c as DNA | RNA);
			set.push(binary);
		}
		const joined = set.join("");
		res.push(joined as Byte);
	}

	return res.join(" ");
}

export async function toText(str: string): Promise<string> {
	const binary = await convertToBinary(str);
	const text = await binaryToText(binary);
	return text;
}

export async function toDNA(str: string): Promise<string> {
	const chars = str.split("");
	const res: DNA[] = [];
	for (const c of chars) {
		const binary = await toBinary(c);
		const dna = await BinaryTo(binary, "dna");
		res.push(...(dna as DNA[]));
	}
	return res.join("");
}

export async function toRNA(str: string): Promise<string> {
	const chars = str.split("");
	const res: RNA[] = [];
	for (const c of chars) {
		const binary = await toBinary(c);
		const rna = await BinaryTo(binary, "rna");
		res.push(...(rna as RNA[]));
	}
	return res.join("");
}
