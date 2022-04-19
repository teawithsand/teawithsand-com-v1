const constant = Buffer.from('expand 32-byte k', "utf-8");

const rotate = (v: number, c: number) => {
    return (v << c) | (v >> (32 - c))
}
/**
 * Note: this implementation should not be considered secure, since it's most likely vulnerable for timming attacks.
 * In fact it should be moved to wasm but whatever.
 */
export class ChaCha20 {
    private readonly input = new Uint32Array(16)
    private readonly buffer = new Uint32Array(16)
    private readonly output = Buffer.alloc(32)
    private cachePos = 64

    constructor(key: Buffer, nonce: Buffer = Buffer.from("00".repeat(12), "hex")) {
        if (key.length !== 32) {
            throw new Error("Key must be 32 bytes long")
        }
        if (nonce.length !== 12) {
            throw new Error("Nonce must be 12 bytes long")
        }

        this.input[0] = constant.readUInt32LE(0);
        this.input[1] = constant.readUInt32LE(4);
        this.input[2] = constant.readUInt32LE(8);
        this.input[3] = constant.readUInt32LE(12);
        this.input[4] = key.readUInt32LE(0);
        this.input[5] = key.readUInt32LE(4);
        this.input[6] = key.readUInt32LE(8);
        this.input[7] = key.readUInt32LE(12);
        this.input[8] = key.readUInt32LE(16);
        this.input[9] = key.readUInt32LE(20);
        this.input[10] = key.readUInt32LE(24);
        this.input[11] = key.readUInt32LE(28);

        this.input[12] = 0;

        this.input[13] = nonce.readUInt32LE(0);
        this.input[14] = nonce.readUInt32LE(4);
        this.input[15] = nonce.readUInt32LE(8);
    }

    private quarterRound = (a: number, b: number, c: number, d: number) => {
        const buf = this.buffer;
        buf[a] += buf[b]; buf[d] = rotate(buf[d] ^ buf[a], 16);
        buf[c] += buf[d]; buf[b] = rotate(buf[b] ^ buf[c], 12);
        buf[a] += buf[b]; buf[d] = rotate(buf[d] ^ buf[a], 8);
        buf[c] += buf[d]; buf[b] = rotate(buf[b] ^ buf[c], 7);
    };

    private makeBlock = (output: Buffer, outputOffset: number) => {
        var i = -1;
        // copy input into working buffer
        while (++i < 16) {
            this.buffer[i] = this.input[i];
        }
        i = -1;
        while (++i < 10) {
            // straight round
            this.quarterRound(0, 4, 8, 12);
            this.quarterRound(1, 5, 9, 13);
            this.quarterRound(2, 6, 10, 14);
            this.quarterRound(3, 7, 11, 15);


            //diaganle round
            this.quarterRound(0, 5, 10, 15);
            this.quarterRound(1, 6, 11, 12);
            this.quarterRound(2, 7, 8, 13);
            this.quarterRound(3, 4, 9, 14);
        }
        i = -1;
        // copy working buffer into output
        while (++i < 16) {
            this.buffer[i] += this.input[i];
            output.writeUInt32LE(this.buffer[i], outputOffset);
            outputOffset += 4;
        }

        this.input[12]++;
        if (!this.input[12]) {
            throw new Error('nonce counter was exausted');
        }
    };

    /**
     * Returns buffer of given length filled with pseudo random bytes.
     */
    getBytes = (len: number): Buffer => {
        var dpos = 0;
        var dst = Buffer.alloc(len);
        var cacheLen = 64 - this.cachePos;
        if (cacheLen) {
            if (cacheLen >= len) {
                this.output.copy(dst, 0, this.cachePos, 64);
                this.cachePos += len;
                return dst;
            } else {
                this.output.copy(dst, 0, this.cachePos, 64);
                len -= cacheLen;
                dpos += cacheLen;
                this.cachePos = 64;
            }
        }
        while (len > 0) {
            if (len <= 64) {
                this.makeBlock(this.output, 0);
                this.output.copy(dst, dpos, 0, len);
                if (len < 64) {
                    this.cachePos = len;
                }
                return dst;
            } else {
                this.makeBlock(dst, dpos);
            }
            len -= 64;
            dpos += 64;
        }
        throw new Error("unreachable code");
    };
}

/*

function ROTATE(v, c) {
    return (v << c) | (v >>> (32 - c));
}
var constants = new Buffer.from('expand 32-byte k');
// module.exports = Chacha20;
function Chacha20(key, nonce) {
    this.input = new Uint32Array(16);

    // https://tools.ietf.org/html/draft-irtf-cfrg-chacha20-poly1305-01#section-2.3
    this.input[0] = constants.readUInt32LE(0);
    this.input[1] = constants.readUInt32LE(4);
    this.input[2] = constants.readUInt32LE(8);
    this.input[3] = constants.readUInt32LE(12);
    this.input[4] = key.readUInt32LE(0);
    this.input[5] = key.readUInt32LE(4);
    this.input[6] = key.readUInt32LE(8);
    this.input[7] = key.readUInt32LE(12);
    this.input[8] = key.readUInt32LE(16);
    this.input[9] = key.readUInt32LE(20);
    this.input[10] = key.readUInt32LE(24);
    this.input[11] = key.readUInt32LE(28);

    this.input[12] = 0;

    this.input[13] = nonce.readUInt32LE(0);
    this.input[14] = nonce.readUInt32LE(4);
    this.input[15] = nonce.readUInt32LE(8);

    this.cachePos = 64;
    this.buffer = new Uint32Array(16);
    this.output = new Buffer(64);
}

Chacha20.prototype.quarterRound = function (a, b, c, d) {
    var x = this.buffer;
    x[a] += x[b]; x[d] = ROTATE(x[d] ^ x[a], 16);
    x[c] += x[d]; x[b] = ROTATE(x[b] ^ x[c], 12);
    x[a] += x[b]; x[d] = ROTATE(x[d] ^ x[a], 8);
    x[c] += x[d]; x[b] = ROTATE(x[b] ^ x[c], 7);
};
Chacha20.prototype.makeBlock = function (output, start) {
    var i = -1;
    // copy input into working buffer
    while (++i < 16) {
        this.buffer[i] = this.input[i];
    }
    i = -1;
    while (++i < 10) {
        // straight round
        this.quarterRound(0, 4, 8, 12);
        this.quarterRound(1, 5, 9, 13);
        this.quarterRound(2, 6, 10, 14);
        this.quarterRound(3, 7, 11, 15);


        //diaganle round
        this.quarterRound(0, 5, 10, 15);
        this.quarterRound(1, 6, 11, 12);
        this.quarterRound(2, 7, 8, 13);
        this.quarterRound(3, 4, 9, 14);
    }
    i = -1;
    // copy working buffer into output
    while (++i < 16) {
        this.buffer[i] += this.input[i];
        output.writeUInt32LE(this.buffer[i], start);
        start += 4;
    }

    this.input[12]++;
    if (!this.input[12]) {
        throw new Error('counter is exausted');
    }
};
Chacha20.prototype.getBytes = function (len: number) {
    var dpos = 0;
    var dst = new Buffer(len);
    var cacheLen = 64 - this.cachePos;
    if (cacheLen) {
        if (cacheLen >= len) {
            this.output.copy(dst, 0, this.cachePos, 64);
            this.cachePos += len;
            return dst;
        } else {
            this.output.copy(dst, 0, this.cachePos, 64);
            len -= cacheLen;
            dpos += cacheLen;
            this.cachePos = 64;
        }
    }
    while (len > 0) {
        if (len <= 64) {
            this.makeBlock(this.output, 0);
            this.output.copy(dst, dpos, 0, len);
            if (len < 64) {
                this.cachePos = len;
            }
            return dst;
        } else {
            this.makeBlock(dst, dpos);
        }
        len -= 64;
        dpos += 64;
    }
    throw new Error('something bad happended');
};
*/