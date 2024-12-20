import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { registerUser } from 'src/auth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const validatePassword = (pwd) => {
    const minLength = pwd.length >= 8
    const hasNumber = /\d/.test(pwd)
    const hasUpperCase = /[A-Z]/.test(pwd)
    const hasLowerCase = /[a-z]/.test(pwd)

    if (!minLength) {
      return 'Password must be at least 8 characters long.'
    }
    if (!hasNumber) {
      return 'Password must contain at least one digit.'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validations
    if (!username || !email || !password || !password2) {
      setError('All fields are required.')
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await registerUser(username, email, password)
      setSuccess('Account created successfully! You can now login.')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      console.error('Register error:', err)
      setError('Unable to create account. Please check your inputs or try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && <CAlert color="success">{success}</CAlert>}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
