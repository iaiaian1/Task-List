import { gql } from '@apollo/client';



const USER = gql`
    query ($token: String){
        user(token: $token)
    }
`
const LOGIN = gql`
    mutation ($user: LoginInput!){
        login (user: $user){
            token
        }
    }
`
const CREATEUSER = gql`
    mutation ($user: CreateUserInput!){
        createUser (user: $user){
            status
            message
        }
    }
`
const FETCHTASKS = gql`
    query ($token: String){
        tasks (token: $token){
            id
            name
            owner
            details
        }
    }
`
const CREATETASK = gql`
    mutation ($task: CreateTaskInput!){
        createTask(task: $task)
    }
`
const UPDATETASK = gql`
    mutation ($task: UpdateTaskInput!){
        updateTask(task: $task)
    }
`
const DELETETASK = gql`
    mutation ($task: DeleteTaskInput!){
        deleteTask(task: $task)
    }
`
export { USER, LOGIN, CREATEUSER, FETCHTASKS, CREATETASK, UPDATETASK, DELETETASK }