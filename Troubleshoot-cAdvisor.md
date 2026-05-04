# 🛠️ Summary of the Troubleshoot

## 1. The "OCI Runtime" & "No such file" Error

* The Problem: Podman-docker was trying to mount internal files (like .containerenv) into directories that didn't exist or were improperly mapped in your Alpine-based images.
* The Fix: We ensured your DOCKER_HOST was correctly pointing to a real, active socket and moved away from problematic mounts in the docker-compose.yml.

## 2. Socket Path Confusion

* The Problem: You had podman-docker and Podman Desktop installed, but your terminal didn't know which "engine" to talk to. podman system connection list was empty.
* The Fix:
* Activated the user-level socket: systemctl --user enable --now podman.socket.
   * Permanently set the DOCKER_HOST variable in your ~/.bashrc to point to /run/user/1000/podman/podman.sock.

## 3. Permission Denied (cAdvisor)

* The Problem: You tried to mount /var/lib/containers/storage, which is a root-only path. As a rootless user, you didn't have permission.
* The Fix: We remapped the volume to your actual user storage at /home/qiddis/.local/share/containers.

## 4. cAdvisor Crash (Invalid Flags)

* The Problem: Your cAdvisor logs showed flag provided but not defined: -podman-endpoint. The version of cAdvisor you were using didn't recognize that flag.
* The Fix: We consolidated the flags into a single command: --podman=unix:///var/run/podman.sock.

------------------------------
## 📝 Final Working Setup Reference
For any future projects on this machine, remember these Golden Rules for Podman-Docker compatibility:

* The Environment: Always ensure echo $DOCKER_HOST returns your user socket path.
* The YAML:
* Use :Z at the end of all volume mounts (e.g., - ./data:/mnt:Z) to handle SELinux permissions.
   * For system-level tools like cAdvisor, use userns_mode: "keep-id".
* The Image: If an Alpine image gives you OCI errors, try the standard Debian-based version of that image (e.g., oven/bun:1 instead of alpine).

Would you like to double-check if your Prometheus configuration is successfully pulling these new cAdvisor metrics?

