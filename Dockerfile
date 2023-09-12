FROM mongo:7.0.0

COPY ./data/ /src/data/
COPY mongorestore.sh /home/mongorestore.sh
RUN chmod 777 /home/mongorestore.sh

CMD /home/mongorestore.sh