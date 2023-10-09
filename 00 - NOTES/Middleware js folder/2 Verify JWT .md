# 2. Verify JWT

- everything same as JWT except the fact that it only checks if JWT starts with “Token “ and if it does not, it returns the response with http request  error 401.
    - meanwhile in JWT optional, it checks for 3 conditions and if any of it fails, instead of sending 401 error, it just sets req.loggedin to false and returns next (). - hence forwarding the control to next middleware or route handler.
- 401 - client error + unauthorized