export type Operation = () => Promise<void>

export default class OperationQueue {
    private queue: Operation[] = []
    private innerIsRunning = false
    constructor(private readonly maxLength: number = Infinity) {
    }

    private runOp = (op: Operation) => {
        this.innerIsRunning = true
        op()
            .finally(() => {
                if (this.queue.length > 0) {
                    const firstElem = this.queue.shift()

                    this.runOp(firstElem)
                } else {
                    this.innerIsRunning = false
                }
            })
    }

    enqueueOperation = (op: Operation) => {
        if (this.innerIsRunning) {
            if (this.queue.length < this.maxLength) {
                this.queue.push(op)
            }
        } else {
            this.runOp(op)
        }
    }

    get isRunning(): boolean {
        return this.innerIsRunning
    }
}