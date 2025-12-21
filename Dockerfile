FROM rabbitmq:3.13-management

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN for i in 1 2 3 4 5; do \
      wget -T 10 -t 1 -O /plugins/rabbitmq_delayed_message_exchange.ez \
      https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.13.0/rabbitmq_delayed_message_exchange-3.13.0.ez && break || \
      echo "retry $i..."; \
      sleep 5; \
    done

RUN rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange

RUN chown -R rabbitmq:rabbitmq /plugins

CMD ["rabbitmq-server"]
