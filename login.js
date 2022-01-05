const express = require('express')
const mongoose = require('mongoose')
const app = express()
const router = express.Router()

module.exports = () => {
  const thisRoute = new SignUpRouter()
  router.post('/signup', ExpressRouterAdapter().adapt(thisRoute))
}

class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// Presentation
// signup-router
class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const newUser = new SignUpUseCase().singUp(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: newUser
    }
  }
}

// Domain
// signup-usecase
class SignUpUseCase {
  async singUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      return new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add account-repo
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    return AccountModel.create({ email, password })
  }
}

app.use(router)

app.listen(4000, () => {
  console.log('server running')
})
