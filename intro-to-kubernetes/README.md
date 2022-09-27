# About

This session is designated to provide you with some introductory materinal to k8s.
By now you should be comfortable with using different Linux commands and understand some basic concepts behind Docker, such as _images_ and _containers_.

Even though the k8s engine is slightly different from the Docker's engine, the basic concepts remain similar.

## Inspiration and Sources

- [A great turoial about k8s Deployments](https://semaphoreci.com/blog/kubernetes-deployment)

The above is a great introduction into basic k8s objects. We'll rely on this tutorial as our main guide.

- The style is taken from [this book](https://leanpub.com/devopskatas). 

By the way, the above is a great book that provides a very good introduction into basic concepts behind Docker (and some other useful products).
What I like the most about the book is that it's a hands-on book.

Disclaimer: I'm not affiliated with any of the parties above.

# Fasten your seatbelts

Let's do some preparations before we dive in.

For Windows and macOS users, it'd include the following steps:
- Start the Docker Desktop or the Docker daemon.
- Enable Kuberentes on top of the Docker for Desktop application. Once the Docker engine is restarted, you'd be able to use Kubernetes locally.

As for Linux-based systems, you'd have to install Docker and Minikube or Microk8s.

Last but not the least important, the `kubectl` CLI tool should be installed. 
Run the `kubectl version` command to see if it's installed.

Note that Kubernetes is typically being run on top of several computers.
However, for the sake of this tutorial, we'll run Kubernetes (or k8s) locally, on top of a single device.

The computers on which Kubernetes is run, are called _cluster_, or _Kubernetes cluster_.

# Inquiring some basic components of the k8s cluster

Let's see the status of the k8s cluster: `kubectl cluster-info`

---

The command:
- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `cluster-info` - a subcommand to find out info about the cluster

---

The output would be something like the below:
```text
Kubernetes control plane is running at https://127.0.0.1:54863
CoreDNS is running at https://127.0.0.1:54863/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```
## Let's throw in some buzzwords

Let's familiarize ourselves with some of the terms. The below is rather a very basic introduction to the realm of Kubernetes.

Kubernetes is just a series of applications that allow us to control containers, i.e. _container orchestration_.

The _Kubernetes control plane_ is the master behind Kubernetes itself, as it controls its every aspect.

One of the components of the _control plane_ is the _API server_ which listens to the commands we issue.

_kubectl_ is the command line interface (CLI) through which the commands to the _Kubernetes API server_ are issued.

We can also communicate with the _Kubernetes API server_ through HTTP and via SDKs, such the Javascript, Python, Go, C#, etc. client libraries.

_CoreDNS_ is the local DNS system running on a k8s cluster. We'll get back to it later.

Additional components would be the _Nodes_, i.e. the actual computers (or virtual machines) which run the workloads.

Commands that are issued to the _API server_ are passed down to the Nodes through _kubelet_, which is the Kubernetes agent running on top of every Node.

Let's inquiry the status of the Nodes by issuing the following command: `kubectl get nodes`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `get` is the subcommand of inquiring short info about a k8s object. For example, the nodes
- `nodes` the name of the k8s object. The object can be specified either in singular or plural.

---

The output of the command would be along these lines:

```text
NAME             STATUS   ROLES                  AGE   VERSION
docker-desktop   Ready    control-plane,master   11m   v1.22.4
```

## They have a name

Let's closely examine the output here (spoiler: it's going to be somewhat similar for other `kubectl get ... ` commands):

- `NAME`: the name of the object. We can use it later to perfrom actions on that object.
- `STATUS`: the status of the object. In the above example, the nodes are ready.
- `ROLES`: specific to the Nodes. The node in the example above has the `master` and `control plane` roles. We won't delve into this property during the session.
- `AGE`: when the object was created
- `VERSION`: the kubelet agent version


Additional documentation about the k8s componentes is available [here](https://kubernetes.io/docs/concepts/overview/components/)

# Run containers

Okay, enough with the introduction. Let's start running some containers on k8s.
Mmmm, it's not possible.

## Enter the Pods

A _Pod_ is an abstraction for containers. A _Pod_ can run several containers inside it.
Typically, we run a single container per one Pod. Adding other containers is possible, but it might complicate your application's  maintenance. 
The Pod is the smallest deployable unit in k8s.

So, how do we do it?

```yaml
#Pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

YAML is a super-set of JSON and is used to describe k8s objects. Let's dive in:

- `apiVersion: v1`: the API version of the k8s object. In this case, it's `v1`
- `kind: Pod`: the kind (type) of the object. In this case, we're creating a Pod.
- `metadata`: some metadata about the object, such as its name. The name is mandatory. 
- `spec:`: additional specifications about the object. 

The `apiVersion`, `kind` and the `metadata` properties are indispensable when creating a new k8s object with YAML.
They contain the most basic info the k8s API needs to know about an object.

The `spec` part is used in the vast majority of the k8s objects specifications, since in many cases you'd need to specify some additional object properties, and this is done under the `spec` section.

In the example above, we need to specify some information about the Pod, i.e. which containers it should run, based on which image and tag, and which port(s) should be exposed.

The `containerPort` property is responsible for exposing the container's port 80, on which the application is running, to other k8s components.

---

NGINX is a light-weight and a very popular server.

---

Now we have a description of the Pod.

Let's create it:

`kubectl create -f Pod.yaml`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `create` an object in the k8s cluster
- `-f` - create an object from a file
- `Pod.yaml` - path to the file

---

The output of the command would be the following:
```text
pod/nginx created
```

The first part, i.e. `pod`, describes which object was created. What follows the `/` is the name of the object that was created.

## Inquiring info about the pod

Let's run the following command: `kubectl get pod nginx`

---

The command:
- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `get` is the subcommand of inquiring short info about a k8s object. For example, a Pod.
- `pod` is the type of the object. It can be specified either in singular or plural.
- `nginx` - the name of the object. If the name of the object is specified, the command's output will be the info about that object.

---

The output of the command:
```text
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          5m47s
```

Let's analyze the output:

---

- `NAME`: the name of the object. We can use it later to perfrom actions on that object.
- `READY`: how many containers out of the designated containers are ready
- `STATUS`: the status of the object. In this case, the Pod is running
- `RESTARTS`: how many restarts have occurred since the object was created.
- `AGE`: how long ago the Pod was created.

---

Let's perform the following command: `kubectl delete pod nginx`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `delete` is the subcommand for deleting an object. Its type (kind) has to follow
- `pod` - a specific k8s object kind. Its name has to follow
- `nginx` - the name of the Pod to be deleted.

---


The output of the command would be:
```
pod "nginx" deleted
```

The output describes that a Pod named "nginx" has been deleted from the k8s cluster.

But when we deleted a Pod, the whole application went down.

It must not happen when our application is running on Production.
Moreover, we should support redudnancy, namely if one of our Pods goes down, we get others.

In other words, we should have Pods up and running all the time, and be able to scale them.

How do we achieve all of this?

# ReplicaSets

Replicasets allow us to scale the application and keep it constantly running.
In the ReplicaSet we describe what we want, and the k8s API finds a way to achieve that.

## Imperative vs Declarative

_Imperative_ means "here are the steps that you need to perform". This is how the programs are written.
_Declarative_ means "here's what we want and we don't care how you get to that".

Namely, the _declarative_ paradigm means we describe certain _state_. The program behind it calculates how it would get to the _desired state_.

ReplicaSet describes a _desired state_ which is being constantly checked by the k8s components. Once the state is breached, k8s tries to reconcile it.

Let's see how we write a ReplicaSet specification:

```yaml
#ReplicaSet.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx-replicas
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

Let's look at the specification from _bottom to top_.
If we start with the lower `spec.template.spec` section, we would see that the Pod specification is as much the same as in the previous section.
Namely, the ReplicaSet requires the Pod specification.

So what does the `spec.template` part refer to?

It's the _template_ for the Pods that would be replicated by the ReplicaSet. But not only does the ReplicaSet replicate the Pods as specified above, it also makes sure _the spec for the Pods is the same_.
For example, the same image is used for all the Pods, and the Pods expose the same port. Of course, we can add more specifications for the Pods, but it's out of the scope of this tutorial.

But how does the ReplicaSet _actually_ control the Pods?

## Enter the labels

In order for the ReplicaSet to be able to actually control the Pods it had created, we label them (namely, we add a special piece of metadata to the Pods).
Note that not only the Pods can get labeled in k8s. 

In the example above the `spec.template.metadata.labels` is responsible for labeling the Pods:
```yaml
metadata:
  labels:
    app: nginx
```
We label the Pods with the `app` label, whose value is `nginx`. The _labels_ work as key-value pairs in k8s.
We can add several labels to the same k8s object.

## Power to the ReplicaSet

In the next part we specify the following properties:

| Property | Description | 
| --- | --- |
| `spec.replicas` | How many replicas of the same Pods should run |
| `spec.selector` | Which Pods will be controlled? |
| `spec.selector.matchLabels` | The Pods will be controlled by specifying the labels. You can specify here more than 1 label and their values |

Finally, we continue to the ReplicaSet's own specification. We're already familiar with the following k8s required specifications:

| Property | Description | 
| --- | --- |
| `apiVersion` | Every k8s object must specify the API version, i.e. `apps/v1` |
| `kind` | The type or _kind_ of the object in question |
| `metadata.name` | The name of the object |

To see the status of the ReplicaSet, let's run the following command: `kubectl get replicaset nginx-replicas`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `get` is the subcommand of inquiring short info about a k8s object.
- `replicaset` is the type of the object that we would like to inquiry. Can be specified in either singular or plural.
- `nginx-replicas` - the name of the object. If we specify a name, the command's output will be the info about that object.

---

The output would be like the following:
```text
NAME             DESIRED   CURRENT   READY   AGE
nginx-replicas   3         3         0       7s
```

Here we see the `DESIRED` and `CURRENT` properties referencing the # of Pods that are already spun up. However, they're still not ready.

We can watch the how the containers inside the Pods come to live by adding the `--watch` flag. This way, we can observe the change in the k8s objects' state:
`kubectl get replicaset nginx-replicas --watch`

To abort the command, we should use the combination of `Control+C` keys.

Now we have the ReplicaSet running. Let's see what happens with the Pods: `kubectl get pods --selector app=nginx`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a k8s cluster
- `get` is the subcommand of inquiring short info about a k8s object.
- `pods` is the type of the object that we would like to inquiry. Here it can be specified either in plural or singular, since we expect more than object in the output.
- `--selector` is an additional option, i.e. _flag_ which would be accepted by the main command and its subcommand. The flag here references the labels.
- `app=nginx` is the _flag_'s argument. In this case, we can send some other additional labels in the following format separated by whitespaces `key1=value1 key2=value2`

---

The output would be like the one below:
```text
NAME                   READY   STATUS              RESTARTS   AGE
nginx-replicas-f2mn7   1/1     Running             0          26s
nginx-replicas-dkjkl   1/1     Running             0          29s
nginx-replicas-5rqqx   1/1     Running             0          32s
```

The command's output is the list of Pods, which matched all the labels specified after the `--selector` flag.

Note that the Pod names were assigned the name of the controlling ReplicaSet and a random value afterwards.

Let's a remove one of the Pods and see what's happening: `kubectl delete pod nginx-replicas-5vc4d`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `delete` is the subcommand for deleting an object. Its type (kind) has to follow
- `pod` - a specific k8s object kind. Its name has to follow
- `nginx-replicas-5vc4d` - the name of the Pod to be deleted. Note that the name of the object has to exactly match so it can be located by the k8s API.

---

Let's run the following command again after we removed a Pod: `kubectl get pods --selector app=nginx`

In the command's output you'll 3 Pods again. Note how immediately the ReplicaSet created a new Pod instead of the deleted one.

It's a good practice to run only stateless applications (as opposed to databases and filestores) on top of a k8s cluster.
Hence, in the vast majority of the cases all your Pods will be controlled by ReplicaSets.

Think of Pods as if they could be deleted by the k8s control plane every moment without any special reason (for example, a Node suddenly goes down).
This approach ensures the applications that are running on top of a k8s cluster are highly available and robust.

# Get Some More Info

In order to inquiry some more info about a k8s object or objects, we can use the `kubectl describe` command.

For example: `kubectl describe replicaset nginx-replicas`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `describe` provides the info in a more elaborate form about an k8s object
- `replicaset` is the type of the object that you'd like to get the info about
- `nginx-replicas` is the name of the object

---

The output would be like the following:

```text
Name:         nginx-replicas
Namespace:    default
Selector:     app=nginx
Labels:       <none>
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  app=nginx
  Containers:
   nginx:
    Image:        nginx
    Port:         80/TCP
    Host Port:    0/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age    From                   Message
  ----    ------            ----   ----                   -------
  Normal  SuccessfulCreate  36m    replicaset-controller  Created pod: nginx-replicas-5vc4d
  Normal  SuccessfulCreate  36m    replicaset-controller  Created pod: nginx-replicas-bwqz8
  Normal  SuccessfulCreate  36m    replicaset-controller  Created pod: nginx-replicas-dx895
  Normal  SuccessfulCreate  2m37s  replicaset-controller  Created pod: nginx-replicas-8ppn2
```

From the above output we have much more info about the ReplicaSet. For example, the related events.
Along with additional pieces of info, we get a slightly more elaborate description of the object.

This might be helpful when some Pods aren't getting scheduled to Nodes. To know why, we would use the `kubectl describe` command on the Pods.

For example: `kubectl describe <pod name>`

From the above we'd get some additional info, as for which Node the Pod is scheduled on, by which k8s entity it's being controlled, its events and so on.

Remember that we have to keep our program up and running no matter what? But what happens when we want to replace the Pods based on the old version of an image with the newer one?

Let's try to update the version of the `nginx` image to something newer, say `1.20.2-alpine`. We'll upgrade the NGINX version and also make the footprint smaller.

Let's update the `ReplicaSet.yaml` file and deploy the change with: `kubectl apply -f ReplicaSet.yaml`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `apply` is used to patch an object if it exist, or create a new one if it doesn't exist
- `-f` the object's info is taken from the file whose path is specified next
- `ReplicaSet.yaml`  is the path of the file.

Note that the `apply` subcommand is frequently used by the developers when working with the k8s CLI, since it does both things:
it creates a new k8s object if it does not exist and alter an existing object.

Thus, the the `create` subcommand is almost never used.

---

Let's run this command to see how the pods are updating: `kubectl get pods --selector app=nginx -w`

Note that the `-w` flag is the shorthand for the `--watch` flag.

Well, nothing has changed. 

So, how do we replace the Pods with the new ones in the ReplicaSet? Would it be dreamy if the Pods got also _gradually_ replaced?
# Enter the Deployments

Let's look at the example above:

```yaml
#Deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx
  replicas: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

Let's view it from _bottom to top_ again:

As you may have noticed, the configuration is identical to the ReplicaSet.

## Deployments in action

First, let's clean up the ReplicaSet: `kubectl delete -f ReplicaSet.yaml`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `delete` is the subcommand for deleting an object. Its type (kind) has to follow
- `-f` from the file
- `ReplicaSet.yaml` is the path of the file

Note that you can specify the file path containing the k8s objects that you'd like to delete.
The API will calculate alone which objects ought to be removed based on the contents of the file

---

Secondly, let's create a k8s Deployment: `kubectl apply -f Deployment.yaml`

After some 5 minutes, let's update the Deployment.yaml file to see what's going on with the new NGINX version: `1.20.2-alpine`.
Now, let's run these commands:

```bash
kubectl apply -f Deployment.yaml
kubectl get pods --select app=nginx --watch
```

The output would be as following:

```text
NAME                  READY   STATUS              RESTARTS   AGE
web-65d59f864-545jp   1/1     Terminating         0          8m31s
web-65d59f864-drk52   1/1     Running             0          8m31s
web-65d59f864-vlwnk   1/1     Running             0          8m31s
web-9456bbbf9-26bkc   0/1     ContainerCreating   0          1s
web-9456bbbf9-pw7l6   1/1     Running             0          5s
web-65d59f864-545jp   0/1     Terminating         0          8m31s
web-65d59f864-545jp   0/1     Terminating         0          8m31s
web-65d59f864-545jp   0/1     Terminating         0          8m32s
...
```

Now you see how k8s is gradually reloading the Pods with the new application version.

Note the naming of the Pods has changed now. Their names contain now the name of the Deployment, which is followed by the Id of ReplicaSet and the Id of a Pod.

So, with the deployments we achieve the following:
 
 - Deployment keeps track of the the application's version
 - Whenever there's a change, it replaces the Pods with the new ones gradually
 - Also, Deployments drive the ReplicaSets, so the underlying ReplicaSet keeps the application stable

Due to the advantages listed above, the ReplicaSets are never used. Instead, we always use Deployments to control stateless applications.

---

Under the hood, a Deployment creates another ReplicSet and starts to dynamically update the sizes of two ReplicaSets at the same time.
The following operations are performed behind the scenes:

- The size of the newly created ReplicaSet is increased by 1. A new Pod with the new specification is created.
- The old ReplicaSet's size is decreased by 1. This causes one of the Pods to get deleted.

The above is repeated till the size of the new ReplicaSet is equal to the size of the Deployment, and the size of the old ReplicaSet is equal to 0.

If you run the `kubectl get replicasets` command, you'd see the output as demonstrated below:

```text
NAME            DESIRED   CURRENT   READY   AGE
web-65d59f864   0         0         0       16m
web-9456bbbf9   3         3         3       8m16s
```

You can note that the newly ReplicSet's size is identical to the # of Pods specified in the Deployment.

Eventually the Pods are gradually replaced with the new ones once the old ones are terminated.

By default, up to 10 older ReplicaSets are kept by Kubernetes.

---

# A word about Services
 
k8s assings every Pod an internal DNS entry and an internal IP address.

Imagine you have 2 or more applications on top of the same k8s cluster that need to communicate internally with each other (as in microservices).

How do they communicate then?

It would be impractical to enter each Pod's internal DNS name into other applications that are running on top of the cluster.

Hence, Kubernetes Service is used to abstract away that nitty gritty stuff.

Service in k8s serves as a load-balancer that load-balances the traffic between the application's Pods based on their labels.

Namely, it's an abstraction from other k8s components that assign every Pod a DNS record internally and an internal IP.

```yaml
#$ervice.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app:nginx
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 80
```

Let's look into the Service's specification:

| Property | Description | 
| --- | --- |
| `apiVersion` | Every k8s object must specify the API version, i.e. `v1` |
| `kind` | The type or _kind_ of the object in question |
| `metadata.name` | The name of the object |
| `spec.selector` | Loadbalance the traffic between the objects based on the labels specified |
| `ports` | Map the Service's ports to the container ports |


Let's deploy a test pod (`TestPod.yaml`) and test the service:

```yaml
#TestPod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: testpod
spec:
  containers:
  - name: nginx
    image: nginx:1.20.2-alpine
```


```bash
kubectl apply -f TestPod.yaml
kubectl exec -it testpod -- /bin/sh
```

There's a new command: `kubectl exec`. Let's dissect it:

---
- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `exec` stands for _execute_, i.e. execute the command on top of the Pod's container
- `-it` - the command's flags. Stands for _interactive_(`i`) _tty_ (`t`). Namely, the container's shell is attached to yours and it's a remote shell
- `testpod` - is the name of the Pod. It's specified after all the flags of the `kubectl exec` command and subcommand.
- `--` - serves as a separator for the `kubectl` command and the commands that would run on top of the container's shell
- `/bin/sh` - the actual command to run on top of the container in the Pod

Note that since there's only one container running inside the Pod, its shell would be referenced by default by the subsequent commands.
---

Now, we're connected to the `nginx` container inside the Pod. Let's add install `curl` on it and run some commands on it:
```bash
apk add curl
curl http://nginx-service.default.svc.cluster.local/
```

Note the URL structure after the `curl` command:
- `http://` - the protocol. The next URL elements are separated by periods (.)
- The name of the service, i.e. `nginx-service`
- The namespace (i.e. `default`). For the sake of brevity, we won't discuss them in this post.
- The `svc` prefix stands for Services
- `cluster.local` - to singal Kubernetes this a local entry inside the cluster itself.

You can also expose the Services externally and publicly, but this is not within the scope of this tutorial.

If the response text includes `Welcome to nginx`, you've completed the tutorial successfully.

Run the `exit` command on top of the container's shell to disconnect from it.

# Wrap Up

Hope this basic introduction was clear enough, so you can continue your expidition into the realm of Kubernetes.




