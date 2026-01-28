import { platform } from 'node:os'

/**
 * get the host address that docker containers can use to reach the host machine
 * on mac/windows this is `host.docker.internal`, on linux it's typically the gateway IP
 */
export function getDockerHost(): string {
  // on linux, we need to use the actual gateway IP
  // on mac/windows, docker provides host.docker.internal automatically
  if (platform() === 'linux') {
    return process.env.DOCKER_HOST_IP || '172.17.0.1'
  }
  return 'host.docker.internal'
}
