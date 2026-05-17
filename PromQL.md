# Perintah PromQL

## Perintah Memantau Traffic Request (Requests per Second)

```Prometheus
rate(http_requests_total[1m])
```

## Perintah untuk menampilkan Jumlah Penggunaan Memori (RAM)

```Prometheus
process_resident_memory_bytes
```

## Perintah untuk melihat latensi Response services/app

```Prometheus
rate(http_request_duration_seconds_sum[1m]) / rate(http_request_duration_seconds_count[1m])
```