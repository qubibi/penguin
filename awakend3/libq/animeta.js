class Animeta {
    constructor(minSpeed = 0.01, maxSpeed = 0.05, minValue = -1, maxValue = 1, pauseFactor = 0) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.pauseFactor = pauseFactor; // 停止時間の調整
        this.currentValue = this.getRandomValue();
        this.targetValue = this.getRandomValue();
        this.currentSpeed = this.getRandomSpeed();
        this.pauseTime = 0; // 停止する時間
        this.pausing = false; // 停止中かどうかのフラグ
    }

    getRandomSpeed() {
        return this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);
    }

    getRandomValue() {
        return this.minValue + Math.random() * (this.maxValue - this.minValue);
    }

    getRandomPauseTime() {
        // pauseFactor によってランダムな停止時間を決定
        return Math.random() * this.pauseFactor;
    }

    aupdate(minSpeed, maxSpeed, minValue, maxValue, pauseFactor) {
        // パラメータを更新
        this.minSpeed = minSpeed !== undefined ? minSpeed : this.minSpeed;
        this.maxSpeed = maxSpeed !== undefined ? maxSpeed : this.maxSpeed;
        this.pauseFactor = pauseFactor !== undefined ? pauseFactor : this.pauseFactor;

        // minValue と maxValue の順序が逆であれば入れ替える
        if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
            this.minValue = maxValue;
            this.maxValue = minValue;
        } else {
            this.minValue = minValue !== undefined ? minValue : this.minValue;
            this.maxValue = maxValue !== undefined ? maxValue : this.maxValue;
        }

        // 現在の値と目標値が新しい範囲外の場合、範囲内に調整
        this.currentValue = Math.max(this.minValue, Math.min(this.currentValue, this.maxValue));
        this.targetValue = Math.max(this.minValue, Math.min(this.targetValue, this.maxValue));

        // 停止中なら停止時間をチェック
        if (this.pausing) {
            this.pauseTime -= 1;
            if (this.pauseTime <= 0) {
                this.pausing = false;
                this.targetValue = this.getRandomValue(); // 新しい目標値
                this.currentSpeed = this.getRandomSpeed(); // 新しいスピードを設定
            }
            return this.currentValue; // 停止中は値を動かさない
        }

        // 現在のスピードを距離に応じて調整
        const distance = Math.abs(this.targetValue - this.currentValue);
        this.currentSpeed = this.minSpeed + (this.maxSpeed - this.minSpeed) * (distance / (this.maxValue - this.minValue));

        // 現在の値が目標値に十分近づいた場合
        if (Math.abs(this.currentValue - this.targetValue) < this.currentSpeed) {
            this.pausing = true; // 停止フラグを立てる
            this.pauseTime = this.getRandomPauseTime(); // ランダムな停止時間を設定
        }

        // 現在の値を目標値に向けて移動
        if (this.currentValue < this.targetValue) {
            this.currentValue = Math.min(this.currentValue + this.currentSpeed, this.targetValue);
        } else {
            this.currentValue = Math.max(this.currentValue - this.currentSpeed, this.targetValue);
        }

        return this.currentValue;
    }

    getCurrentSpeed() {
        return this.currentSpeed;
    }
}
