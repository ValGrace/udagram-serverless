import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    
    const user = getUserId(event)
    const todos = getTodosForUser(user)

    return {
      statusCode: 200,
      body: JSON.stringify({
        'item': todos
      })
    }  
    
  }
)
handler.use(
  cors({
    credentials: true
  })
)
