class TimersManager {
    constructor() {
        this.timers = new Map();
        this.timersIds = new Map();
    }

    add(timer, ...args) {
        timer = {
            ...timer,
            args
        }
        this.timers.set(timer.name, timer);
        return this;
    }

    remove(timer) {
        const {name} = timer;
        if (this.timers.get(name)) {
            this.timers.delete(name);
        } else {
            console.log(`Timer ${name} not found `);
        }
    }

    start() {
        this.timers.forEach((value, key, map) => {
            this._startTimer(value);
        })
    }

    stop() {
        this.timers.forEach((value, key, map) => {
            const {
                name,
                delay,
                interval,
                job,
                args
            } = value;
            this._stopTimer(name, interval);
        })
    }

    pause(timer) {
        const {name, interval} = timer;
        this._stopTimer(name, interval)
    }

    resume(timer) {
        const {name} = timer;

        this._startTimer(this.timers.get(name));
    }

    _startTimer(timer) {
        const {
            name,
            delay,
            interval,
            job,
            args
        } = timer;

        let timeId = null;
        if (interval) {
            timeId = setInterval(job, delay, ...args);
        } else {
            timeId = setTimeout(job, delay, ...args);
            setTimeout(() => {
                this._stopTimer(name)
            }, delay + 1);
        }
        this.timersIds.set(name, timeId);
    }

    _stopTimer(name, interval) {
        if (this.timersIds.has(name)) {
            if (interval) {
                clearInterval(this.timersIds.get(name));
            } else {
                clearTimeout(this.timersIds.get(name));
            }
            this.timersIds.delete(name);
        } else {
            console.log('Timer has already stopped :>> ');
        }
    }

    print() {
        console.log('timers :>> ', this.timers);
        console.log('timersIds :>> ', this.timersIds);
    }
}

const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 500,
    interval: false,
    job: () => {
        console.log('t1')
    }
};

const t2 = {
    name: 't2',
    delay: 1100,
    interval: true,
    job: (a, b) => {
        console.log(a + b);
        return a + b
    }
};

manager.add(t1).add(t2, 1, 2);
manager.print();
// manager.remove(t1);
manager.start();
setTimeout(() => {
    manager.pause(t2);
    manager.print()
}, 3400)

setTimeout(() => {
    manager.resume(t1);
}, 4000)
