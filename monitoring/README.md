# Exercise 4.3

Prometheus query:

```promql
count(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})
```
