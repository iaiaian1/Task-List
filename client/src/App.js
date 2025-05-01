/* global bootstrap */
import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { USER, LOGIN, CREATEUSER, FETCHTASKS, CREATETASK, UPDATETASK, DELETETASK } from './apollo/apolloQueries'

/*
  I will be using vanilla react.js and bootstrap here since this is just gonna be a single-page app.
  I cannot use components since everything is depreciated in react.js, cannot use Next.JS and I have no time.
  Bootstrap should do the job much better than me anyways.
*/

function App() {
  // States
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [taskId, setTaskId] = useState('')
  const [taskName, setTaskName] = useState('')
  const [taskDetails, setTaskDetails] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Apollo GraphQL calls
  // Mutations
  const [login, { loading: loginLoading, error: loginError, data: loginData }] = useMutation(LOGIN, { refetchQueries: [{ query: FETCHTASKS }] })
  const [createUser, { loading: createUserLoading, error: createUserError, data: createUserData }] = useMutation(CREATEUSER)
  const [createTask, { loading: createTaskLoading, error: createTaskError, data: createTaskData }] = useMutation(CREATETASK, { refetchQueries: [{ query: FETCHTASKS }] })
  const [updateTask, { loading: updateTaskLoading, error: updateTaskError, data: updateTaskData }] = useMutation(UPDATETASK, { refetchQueries: [{ query: FETCHTASKS }] })
  const [deleteTask, { loading: deleteTaskLoading, error: deleteTaskError, data: deleteTaskData }] = useMutation(DELETETASK, { refetchQueries: [{ query: FETCHTASKS }] })

  // Queries
  const { loading: userLoading, error: userError, data: userData } = useQuery(USER, { variables: { token: localStorage.getItem('authToken') } }, { skip: isLoggedIn })
  const { loading: fetchTasksLoading, error: fetchTasksError, data: fetchTasksData, refetch: fetchTasksRefetch } = useQuery(FETCHTASKS, { variables: { token: localStorage.getItem('authToken') } }, { skip: !isLoggedIn })

  // Functions
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      let result = await login({ variables : { user: { email, password } } })
      setIsLoading(loginLoading)
      let token = result.data.login.token

      if(token){
        localStorage.setItem('authToken', token)
        setIsLoggedIn(true)
        const modalElement = document.getElementById('exampleModal1')
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
        modalInstance.hide()
      }else{
        alert('Wrong credentials')
      }
    } catch (error) {
      alert("error:", error)
    }
  }
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      let result = await createUser({ variables : { user: { name, email, password } } })
      setIsLoading(createUserLoading)
      let data = result.data.createUser
      if(data.status){
        alert(data.message)
        const modalElement = document.getElementById('exampleModal2')
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement)
        modalInstance.hide();
      }else{
        alert(data.message)
      }
      
    } catch (error) {
      alert("error:", error)
    }
  }
  
  const handleCreateTask = async (e) => {
    e.preventDefault()

    try {
      let result = await createTask({ variables : { task: { name: taskName, owner: localStorage.getItem('authToken'), details: taskDetails } } })
      setIsLoading(createTaskLoading)
      if(result.data.createTask){
        alert('Task created successfully!')
        // I have to refetch here, i dont know why the callback refetch above does not work.
        fetchTasksRefetch()
      }else{
        alert('Something went wrong.')
      }
      
    } catch (error) {
      alert("error:", error)
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()

    try {
      let result = await updateTask({ variables : { task: { id: taskId, name: taskName, details: taskDetails } } })
      setIsLoading(updateTaskLoading)
      if(result.data.updateTask){
        alert('Task updated successfully!')
      }else{
        alert('Something went wrong.')
      }
      
    } catch (error) {
      alert("error:", error)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      let result = await deleteTask({ variables : { task: { id } } })
      setIsLoading(deleteTaskLoading)
      if(result.data.deleteTask){
        alert('Task updated successfully!')
        // I have to refetch here, i dont know why the callback refetch above does not work.
        fetchTasksRefetch()
      }else{
        alert('Something went wrong.')
      }
      
    } catch (error) {
      alert("error:", error)
    }
  }
  
  // Use effects
  // Auto login - to be deleted
  useEffect(() => {
    if(!userLoading && !userError){
      if (userData.user === true) {
        setIsLoggedIn(true);
      }
    }
  },[userLoading])
  
  // Tasks - to be deleted
  useEffect(() => {
    console.log(fetchTasksLoading)
    if(!fetchTasksLoading && !fetchTasksError){
      console.log(fetchTasksData)
    }
  },[fetchTasksLoading])

  // For loading effect
  useEffect(() => {
    setIsLoading(loginLoading)
  }, [userLoading, loginLoading, createUserLoading, createTaskLoading, updateTaskLoading]);

  // Clearing fields for modal close. Clear login/signup fields
  useEffect(() => {
    let handleModalHidden = () => {
      setName('')
      setEmail('');
      setPassword('');
    };

    let loginModal = document.getElementById('exampleModal1')
    let signUpModal = document.getElementById('exampleModal2')

    if (loginModal) {
      loginModal.addEventListener('hidden.bs.modal', handleModalHidden)
    }

    if(signUpModal){
      signUpModal.addEventListener('hidden.bs.modal', handleModalHidden)
    }
  }, [])

  return (
    <>
      {/* Barbaric method to swap these two divs! */}
      {/* Login */}
      {!isLoggedIn && (
        <div className={`position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-bg-dark bg-gradient`}>
          <h1 className='text-primary'>Simple Task List!</h1>
          <h3>Built using: GraphQL, Sequelive(SQLite) and Vanilla React.js(with Bootstrap!).</h3>
          
          <div className='mt-3 d-flex gap-3'>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">Login to proceed</button>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">Sign-up</button>
          </div>
        </div>
      )}
      {/* Main page */}
      {isLoggedIn && (
        <div className={`position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-bg-dark bg-gradient`}>
          <h1 className='text-primary'>Simple Task List!</h1>
          <div className="list-group">
            {fetchTasksData && fetchTasksData.tasks.map((task, index) => (
                <li key={task.id} className="list-group-item d-flex gap-5 justify-content-between align-items-center">
                  <span>{index + 1}. {task.name} - {task.details}</span>
                  <div className='d-flex gap-2'>
                    <button onClick={() => { setTaskId(task.id); setTaskName(task.name); setTaskDetails(task.details) }} type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal3">Update</button>
                    <button onClick={() => handleDeleteTask(task.id) } className="btn btn-sm btn-danger">Delete</button>
                  </div>
                </li>

            ))}
            {fetchTasksData && fetchTasksData.tasks.length < 1 && (
                <h2>No tasks!</h2>
            )}
          </div>     
          <div className='mt-3 d-flex gap-3'>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal4">Create Task</button>
            <button type="button" className="btn btn-danger" onClick={() => { localStorage.removeItem('authToken'); setIsLoggedIn(false) }}>Logout</button>
          </div>
        </div>
      )}

      {/* Spinner which overrides everything */}
      {isLoading && (
        <div className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-opacity-25 bg-light z-3'>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Separate modals */}
      {/* Login modal */}
      <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={ handleLogin }>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Log in</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
              <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value)}></input>
                <br>
                </br>
                <label for="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={ password } onChange={ (e) => setPassword(e.target.value)}></input>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
            </form>
        </div>
      </div>

      {/* Sign up modal */}
      <div className="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={ handleSignUp }>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Sign up</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <label for="exampleName2">Name</label>
                <input type="text" className="form-control" id="exampleInputName2" aria-describedby="name" placeholder="Enter name" value={ name } onChange={ (e) => setName(e.target.value)}></input>
                <br>
                </br>
                <label for="exampleInputEmail2">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value)}></input>
                <br>
                </br>
                <label for="exampleInputPassword2">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Password" value={ password } onChange={ (e) => setPassword(e.target.value)}></input>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Sign up</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
            </form>
        </div>
      </div>

      {/* Update task modal */}
      <div className="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel3" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={ handleUpdateTask }>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Update task</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <label for="exampleName2">Task Name</label>
                <input type="text" className="form-control" id="exampleInputName3" aria-describedby="name" placeholder="Enter name" value={ taskName } onChange={ (e) => setTaskName(e.target.value)}></input>
                <br>
                </br>
                <label for="exampleInputEmail2">Task Details</label>
                <input type="text" className="form-control" id="exampleInputEmail3" aria-describedby="emailHelp" placeholder="Enter task details" value={ taskDetails } onChange={ (e) => setTaskDetails(e.target.value)}></input>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Update Task</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
            </form>
        </div>
      </div>

      {/* Create task modal */}
      <div className="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel4" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={ handleCreateTask }>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Create task</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <label for="exampleName2">Task Name</label>
                <input type="text" className="form-control" id="exampleInputName4" aria-describedby="name" placeholder="Enter name" value={ taskName } onChange={ (e) => setTaskName(e.target.value)}></input>
                <br>
                </br>
                <label for="exampleInputEmail2">Task Details</label>
                <input type="text" className="form-control" id="exampleInputEmail4" aria-describedby="emailHelp" placeholder="Enter task details" value={ taskDetails } onChange={ (e) => setTaskDetails(e.target.value)}></input>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Create Task</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
            </form>
        </div>
      </div>

    </>

    // react boilerplate, for reference
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
