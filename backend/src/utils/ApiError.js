class ApiError extends Error {
    constructor(
        status,
        message= "Something went wrong",
        errors = []
    ){
        super(message)
        this.status = status
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

    }
}

export { ApiError }