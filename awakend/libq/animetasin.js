class Animetasin {
    constructor(baseSpeed = 20, speedVariation = 1.5, complexityFactor = 50) {
        this.baseSpeed = baseSpeed;          // 基本の速さ（大きいほど遅い）
        this.speedVariation = speedVariation;// 速度変化の幅
        this.complexityFactor = complexityFactor; // 複雑さの周期
        this.phase = Math.random() * 1000;   // 開始位置をランダムに
    }

    update() {
        return (
            sin(frameCount/(this.baseSpeed + sin(frameCount/this.complexityFactor)*this.speedVariation)) + 
            sin(frameCount/((this.baseSpeed * 2.5) + sin(frameCount/(this.complexityFactor * 1.5))*this.speedVariation))
        ) * 0.5;
    }

    // パラメータ更新用メソッド
    setParams(baseSpeed, speedVariation, complexityFactor) {
        this.baseSpeed = baseSpeed !== undefined ? baseSpeed : this.baseSpeed;
        this.speedVariation = speedVariation !== undefined ? speedVariation : this.speedVariation;
        this.complexityFactor = complexityFactor !== undefined ? complexityFactor : this.complexityFactor;
    }

    // 位相をリセット
    resetPhase() {
        this.phase = Math.random() * 1000;
    }
}