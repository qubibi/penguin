class qt {
    static generateTweenArrays(keyframes) {
        if (keyframes.length < 2) {
            throw new Error("少なくとも2つのキーフレームが必要です");
        }

        const lastFrame = keyframes[keyframes.length - 1].frm;
        const result = new Array(lastFrame + 1);

        for (let i = 0; i <= lastFrame; i++) {
            const currentFrame = { frm: i };
            const prevKeyframe = keyframes.find((kf, index) => kf.frm <= i && (index === keyframes.length - 1 || keyframes[index + 1].frm > i));
            const nextKeyframe = keyframes.find(kf => kf.frm > i) || keyframes[keyframes.length - 1];

            for (const prop in prevKeyframe) {
                if (prop === 'frm') continue;

                const start = prevKeyframe[prop];
                const end = nextKeyframe[prop];

                if (i === nextKeyframe.frm) {
                    currentFrame[prop] = end;
                } else if (typeof start === 'number' && typeof end === 'number') {
                    const progress = (i - prevKeyframe.frm) / (nextKeyframe.frm - prevKeyframe.frm);
                    currentFrame[prop] = this.lerp(start, end, progress);
                } else if (this.isHexColor(start) && this.isHexColor(end)) {
                    const progress = (i - prevKeyframe.frm) / (nextKeyframe.frm - prevKeyframe.frm);
                    currentFrame[prop] = this.lerpColor(start, end, progress);
                } else {
                    currentFrame[prop] = start;
                }
            }

            result[i] = currentFrame;
        }

        return result;
    }

    // その他のメソッドは変更なし
    static lerp(start, end, amt) {
        return start + (end - start) * amt;
    }

    static isHexColor(color) {
        return /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/.test(color);
    }

    static lerpColor(start, end, amt) {
        const startRGB = this.hexToRgb(start);
        const endRGB = this.hexToRgb(end);
        const resultRGB = {
            r: Math.round(this.lerp(startRGB.r, endRGB.r, amt)),
            g: Math.round(this.lerp(startRGB.g, endRGB.g, amt)),
            b: Math.round(this.lerp(startRGB.b, endRGB.b, amt)),
            a: this.lerp(startRGB.a, endRGB.a, amt)
        };
        return this.rgbToHex(resultRGB);
    }

    static hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b, a) => r + r + g + g + b + b + (a ? a + a : ''));
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: result[4] ? parseInt(result[4], 16) / 255 : 1
        } : null;
    }

    static rgbToHex(rgb) {
        const toHex = (value) => {
            const hex = Math.round(value).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}${rgb.a < 1 ? toHex(Math.round(rgb.a * 255)) : ''}`;
    }
}