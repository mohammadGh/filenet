# filenet
`FileNet` is a utility tool designed for sending file data in chunks over a network. By creating a TCP server that serves a file, it allows multiple clients to receive the file in chunks simultaneously.

## Use as CLI
FileNet is available as a command-line tool. To install it, use npm or pnpm.

```bash
# npm
npm install -g filenet

# pnpm
pnpm install -g filenet
```
to run the command use directly the name of command `filenet` or use `npx run filenet`.

## Serve a file
To setup a tcp server and serve a file use as below:

```bash
filenet --chunksize 2M --delay 100ms -host 0.0.0.0 -port 6016 /tmp/file.mp4
```
This command, run a server on port `6016` and listen for new client to connect and receive a file.
when each client is connected, it receives file by chunks (each chunk is 10 MB).

for example to receive a file using `netcat` on the same machine, use this command on a new terminal:

```bash
nc 127.0.0.1 6016 > file.mp4
```
