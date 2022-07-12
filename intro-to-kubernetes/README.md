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

# Fasten your seatbelts

![dashboard.jpg]()

[Image by Vitali Adutskevich](https://unsplash.com/photos/Dq3Z2bQVuHU?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink)

Let's do some preparations before we dive in:
- Start the Docker Desktop or the Docker deamon.
- The `kubectl` CLI tool. This tool allows us to communicate with the k8s API that would create what we need for us. Run the `kubectl version` command to see if it's installed.
- The `minikube` tool. Usually comes preinstalled with the Docker for Desktop. Run the `minikube start` command in your terminal to see if it's instaled.

Let's start our k8s cluster locally with the following command: `minikube start --driver docker --nodes 2`

---

The command:
- `minikube` - The parent command for running a k8s cluster locally.
- `start` - the subcommand for starting a k8s cluster.
- `--driver docker` - we'll run the k8s cluster based on the Docker driver. We'll build and use the images locally.
- `--nodes 2` - the number of the Nodes in the cluster.

---

By running the command above, we're starting a local k8s cluster based on the Docker driver with 2 virtual computers, i.e. _Nodes_.

It'll take several minutes for the cluster to start up. Expected output would be:
```text
Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default.
```

## A small recap

- There's a Kubernetes _server_ than connects to the _nodes_, i.e. a set of computers via _kubelet_, an agent installed on each server.
- All the commands are issued to the k8s server, and then passed down to the kubelets.

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

The _Kubernetes control pane_ is the API server to which the commands are issues.

_CoreDNS_ is the local DNS system running on a k8s cluster. We'll get back to it later.


Let's see the nodes' status in the clsuter: `kubectl get nodes`

---

The command:

- `kubectl` is the main command for the running all other CLI commands against a a k8s cluster
- `get` is the subcommand of inquiring short info about a k8s object. For example, the nodes
- `nodes` the name of the k8s object. In singular, we have to specify the name of the object. In pluar, we'll get all the objects of the same kind.
   In the above example, we'd like to get info about all the nodes.

---

The output of the command would be along these lines:

```text
NAME       STATUS   ROLES                  AGE   VERSION
minikube   Ready    control-plane,master   77d   v1.23.3
...
```

## They have a name

Let's closely examine the output here (spoiler: it's going to be somewhat similar for other `kubectl get ... ` commands):

- `NAME`: the name of the object. We can use it later to perfrom actions on that object.
- `STATUS`: the status of the object. In the above example, the nodes are ready.
- `ROLES`: specific to the Nodes. The node in the example above has the `master` and `control pane` roles. We won't delve into this property during the session.
- `AGE`: when the object was created
- `VERSION`: the kubelet agent version

# Run containers

Okay, enough with the introduction. Let's start running some containers on k8s.
Mmmm, it's not possible.

## Enter the Pods

A _Pod_ is an abstraction for containers. A _Pod_ can run several containers inside it.
Typically, we run a single container per one Pod. Adding other containers to a Pod might complicate the maintenance of the application that you're running on k8s, as you'd need to keep a close eye on the container interdependencies and so on.
The Pod is the smallest deployable unit in k8s.

So, how do we do it?

```yaml
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

As a Pod runs containers, we provide information about the containers it runs, such as their name, image and tag that they're based on, ports through which they're exposed.

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
- `pod` - a specific k8s object kind. Its name has to follow
- `nginx` - the name of the object

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

In other words, we should have Pods up and running all the time, and able to scale them.

How do we do achieve all of this?

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
If we start with the lower `spec.template.spec` section, we would see that the Pod specification is much the same as in the previous section.
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
We label the Pods with the `app` label and its contents is `nginx`. The _labels_ work as key-value pairs in k8s.
We can add several labels to the same k8s object.

## Power to the ReplicaSet

In the next part we specify the following properties:

| Property | Description | 
| --- | --- |
| `spec.replicas` | How many replicas of the same Pods should run |
| `spec.selector` | Which Pods will be controlled? |
| `spec.selector.matchLabels` | The labels of the Pods that should be matched |

The above refers to exactly which Pods should be controlled by it (i.e. via the labels).

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
- `replicaset` is the type of the object that we would like to inquiry
- `nginx-replicas` - the name of the object

---

The output would be like the following:
```text
NAME             DESIRED   CURRENT   READY   AGE
nginx-replicas   3         3         0       7s
```

Here we see the `DESIRED` and `CURRENT` properties referencing the # of Pods that are already spun up. However, they're still not ready.

We can watch the how the containers inside the Pods come to live by adding the `--watch` flag. This way, we can observe the change in the k8s objects' state:
`kubectl get replicaset nginx-replicas --watch`

To abort the command, we should use the combination of Control+C keys.

Now we have the ReplicaSet running. Let's see what happens with the Pods: `kubectl get pods --selector app=nginx`

Note that we added the `--selector` flag which is followed by the `app=nginx` label. Namely, we also can use the labels as selectors in our queries.

The output would be like the one below:
```text
nginx-replicas-5vc4d   1/1     Running   0          5m42s
nginx-replicas-bwqz8   1/1     Running   0          5m42s
nginx-replicas-dx895   1/1     Running   0          5m42s
```

Note that the Pod names were assigned the name of the controlling ReplicaSet and a random value afterwards.

In stateless applications the Pod name matters less. Why? Let's imagine a situation one of the Nodes goes down.
k8s will notice the change in the Node state and remove the Pods from there.

Namely, the _Pods are ephemeral_. It's good practice not to save any state on the Pods, since they can be removed at any given time.

Let's a remove one of the Pods and see what's happening: `kubectl delete pod <pod name>`

Let's run the following command again: `kubectl get pods --selector app=nginx`

In the command's output you'll 3 Pods again. Note how immediately the ReplicaSet created a new Pod instead of the deleted one.

# Get Some More Info

In order to inquiry some more info about a k8s object, we can use the `kubectl describe` command.

For example: `kubectl describe replicaset nginx-replicas`

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

Note the `apply` part. Typically this subcommand is used to create and/or update the objects in k8s.

Let's run this command to see how the pods are updating: `kubectl get pods --selector app=nginx -w`

Well, nothing has changed. 

So, how do we replace the Pods with the new ones in the ReplicaSet and also gradually without downtime?
# Enter the Deployments

Let's look at the example above:

```yaml
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
By the way, the ReplicaSet objecs are never used. Instead, the Deployments are used.
## Deployments in action

First, let's clean up the ReplicaSet: `kubectl delete -f ReplicaSet.yaml`

Secondly, let's create a k8s Deployment: `kubectl apply -f Deployment.yaml`

Let's update the Deployment.yaml file to see what's going on with the relevant NGINX version: `1.20.2-alpine`.
Now, let's run these commands:

```bash
kubectl apply -f Deployment.yaml
kubectl get pods --select app=nginx --watch
```

Now you see how k8s is gradually reloading the Pods with the new application version.

So, with the deployments we achieve the following:
 
 - Deployment keeps track of the the application's version
 - Whenever there's a change, it replaces the Pods with the new ones gradually
 - Also, Deployments drive the ReplicaSets, so the underlying ReplicaSet keeps the application stable

# A word about Services

Currently the application is running, but how can we communicate with it?
 
 k8s assings every Pod an IP address, but how do you navigate till that Pod?

Service in k8s servers as a load-balancer that load-balances the traffic between the application's Pods based on their labels.

Namely, it's an abstraction from other k8s components that assign every Pod a DNS record internally and an internal IP.

```yaml
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
Let's deploy a test pod (`TestPod.yaml`) and test the service:
```bash
kubectl apply -f TestPod.yaml
kubectl exec -it nginx -- /bin/sh
```

Now, we're on the test Pod. Let's add install `curl` on it and run some commands on it:
```
apk add curl
curl http://nginx-service.default.svc.cluster.local/
```
Note the URL structure:
- The name of the service
- The namespace (i.e. `default`)
- The `svc` prefix stands for Services
- `cluster.local`




