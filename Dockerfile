FROM node

WORKDIR /home/mean

# Install Mean.JS packages
ADD package.json /home/mean/package.json
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Make everything available for start
ADD . /home/mean

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729

# Run MEAN.JS server
CMD npm install && npm start
