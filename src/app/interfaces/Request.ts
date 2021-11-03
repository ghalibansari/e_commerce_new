import { Request } from 'express'
import { ClientSession } from 'mongoose'

export interface RequestWithTransaction extends Request {
    mongoSession: ClientSession
}