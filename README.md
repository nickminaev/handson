# Hands On Sesion - Docker

## Hello world!

`docker run hello-world`

You'll see an output similar to the following:
```text
Unable to find image 'hello-world:latest' locally
```

### What happens behinds the scenes

- Docker tries to find an _image_ locally. Its name is specified immediately after the `run` subcommand. _Image_ is a blueprint from which you can create various _containters_.
- _Container_ is a running instances of an image. 
- Docker tries to find an image locally. If it does not find it, it goes to Docker Hub and tries to download it from there.
- _Docker Hub_ is a public repository of the images, where you can find diverse programs packages into Docker images.
- After the image is being downloaded, it's being run

**Note:** typically an image would contain a single a single program. It's a good practice to dedicate your image to a single program.

## List the Containers

`docker ps`

Lists all the _running_ containers. To list all the containers regardless of their status, run `docker ps -a`
Output:

```text
CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS                        PORTS      NAMES
606467e2e8a1   hello-world                           "/hello"                 47 seconds ago   Exited (0) 45 seconds ago                focused_spence
```

Every container gets its ID; there's an image from which the container was created; the command it's run; its status, its ports and name.

Another flag: `-q`. It means "list only the container IDs". For example: `docker ps -aq`

Note that when running a container, Docker will assign it a random name. Two container cannot have the same name

## Run a named container

`docker run --name my-container -it node bash`

Let's dismantle the command:

- `docker` is the _parent command_
- `run` is the subcommand
- Other _flags_ (options), such `--name` (give a name to the container); `-i` stands for interactive; `-t` (pseudo-tty): an interface between 
- Command to be executed on the container: `bash`. It's the Linux shell 

By running this command, we've launched a separate operating system and we're in its shell, to which we're remotely connected.
Let's look at the output:
```
root@2dc3ea906dc4:/# 

```
The first one denotes the username on the container and another one the host name. In this case, its the container ID.
We can issue a series of commands and we'll see a different data from what we see on our computers:

```bash
mkdir /server
cd /server
npm install express --save
exit
```

The container will be stopped. To observe its status, we can issue the following command `docker inspect my-container`
However, the output might be too lengthy. We can filter out the needed infromation:

`docker inspect my-container -f '{{ .State.Status }}'`

## Building a small NodeJS web server

Let's copy the server.js to the container (yes, we can copy files to exited containers):

`docker cp server.js my-container:/sever/server.js`

Let's look into the command:
- `docker cp`: the parent command
- `server.js`: the file in question
- `my-container:`: the name of the container we're copying the file(s) to
- `/server/server.js`: the full path to the file

To save the result, we can run the following command:

`docker commit my-container my-server`

Now we've built our _custom image_. Let's analyze the command:
- `docker commit`: the parent command
- `my-container`: the container from which the image would be derived
- `my-server`: the name of the image

Let's verify the newly created image is there:
`docker image ls`

The output would be something along these lines:
```text
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
my-server    latest    028de35e599b   22 minutes ago   1GB
node         latest    372b746c33bc   42 hours ago     998MB
```

You can note the image size is quite big. We were "sold" the idea they were compact. We'll discuss a trick to reduce the image size significantly later.
Finally, let's run our server:
`docker run --name server -p 80:80 -d my-server node /server/server.js`

Let's look into the command's anatomy again:
`docker run [...options] [image name] [commands and arguments]`

Let's look at the new flags we have here:
- `-d` - detached mode, as opposed to `-it`
- `-p` - port mapping. Here we map port on the left (our computer's port) to the container's port (on the right). Namely: `-p <host port>:<container port>`.

## A more convenient way to build an image

We can describe an image with a `Dockerfile`. Let's analyze the contents of the file:
```Dockerfile
FROM node
WORKDIR /server
RUN npm install express --production
COPY server.js .
CMD ["node", "server.js"]
```
Note that every Dockerfile has to start with the `FROM` statement. Namely, we build our image from a *base image*.
The `WORKDIR` statements creates the directory *and* sets as the working directory. You can switch the working directory in the image as many times as you like.
The `RUN` command runs a command for us in a temporary container's shell upon *image build*.
Then, the `CMD` statement runs the command upon *image activation*.

The container's lifecycle:
- Build time
- Initialization
- Runtime
- Stopped/Removed

Let's run the following command: `docker build -t my-server .`

The `docker build` command searches for a Dockerfile and builds an image from it. Let's run `docker image ls` to see the image is there.

### CMD vs ENTRYPOINT

Let's run our container by issuing the following command:
`docker run --name sever -it my-server bash`

## Docker exec?

