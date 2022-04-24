consul {
  retry {
    enabled     = true
    attempts    = 3
    backoff     = "50ms"
    max_backoff = "10s"
  }
}

log_level = "info"

template {
  source      = "./docker/templates/.env.tmpl"
  destination = "./config/.env"
  perms       = 0644
  backup      = false
}

template {
  source      = "./docker/templates/stack-driver-google-service-account.json.tmpl"
  destination = "./config/stack-driver-google-service-account.json"
  perms       = 0644
  backup      = false
}

template {
  source      = "./docker/templates/key.pub.tmpl"
  destination = "./config/key.pub"
  perms       = 0644
  backup      = false
}
