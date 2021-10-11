import {ClientSession} from 'mongoose'
import {Request} from 'express'

export interface RequestWithTransaction extends Request {
    mongoSession: ClientSession
}