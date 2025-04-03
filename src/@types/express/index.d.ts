import type * as express from "express"; // this is being imported only so the IDE can recognize the type
import type { User } from "@prisma/client";

declare global { // this is a global namespace for the express module so that we can add a new property to the request object
    namespace Express { // this is a namespace for the express module 
        export interface Request { // this is a new property that we are adding to the request object
            user?: User
        }
    }
}