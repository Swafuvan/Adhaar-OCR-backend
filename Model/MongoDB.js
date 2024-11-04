import mongoose from 'mongoose'

const MongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://swafuvancp:omXkw1nquo4ZJobK@cluster0.pij1lwx.mongodb.net/AdhaarOCR')
        console.log('MongoDB Connected')
    } catch (error) {
        console.log('Connection failed'+ error)
        process.exit(1)
    }
}

export default MongoDB
