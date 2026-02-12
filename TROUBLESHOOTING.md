## How to start Desktop Modeler without plugins

You can start Desktop Modeler with the `--disable-plugins` flag.

## How to obtain Desktop Modeler logs

Depending on your operating system, you can find Desktop Modeler logs in different places:

```plain
%APPDATA%\cognito-modeler\logs
```

```plain
~/Library/Logs/cognito-modeler
```

```plain
~/.config/cognito-modeler/logs
```

To produce logging output, you can also run Desktop Modeler from the command line.

## Desktop Modeler does not start on macOS
Unsigned builds (especially on Apple Silicon) may be blocked by Gatekeeper. You may see:
```plain
“Cognito Modeler” is damaged and can’t be opened. You should move it to the Bin.
```

Temporary workaround (removes the quarantine attribute for this app only):
```bash
xattr -dr com.apple.quarantine "/path-to-cognito-modeler/Cognito Modeler.app"
```

For unsigned x64 builds you may instead see:
```plain
“Cognito Modeler” Not Opened
Apple could not verify “Cognito Modeler” is free of malware that may harm your Mac or compromise your privacy.
```

To bypass this:
1. Open System Settings.
2. Go to Privacy & Security.
3. In the Security section find the message: `“Cognito Modeler” was blocked to protect your Mac.`
4. Click Open Anyway, then confirm.

## Desktop Modeler does not start on Ubuntu 24 / modern Linux
Modern Linux distributions (Ubuntu 23+ and Debian 12+) enforce stricter controls on unprivileged user namespaces. Electron relies on those namespaces for sandboxing, so these changes can prevent Electron-based apps from starting. You may see an error message when you start the application:


```sh
$ ./cognito-modeler
[35900:0922/124345.325190:FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that [...]/cognito-modeler-[...]-linux-x64/chrome-sandbox is owned by root and has mode 4755.
zsh: trace trap (core dumped)  ./cognito-modeler
```

To fix this, configure your system to allow sandboxing (for example by creating an AppArmor profile) or apply one of the workarounds listed below. If you do not have permissions to enable sandboxing permanently, temporary options are available but not recommended.

### Root Solutions (requires `sudo`)

#### 1. Create an AppArmor Profile (**Recommended**)
Create a permanent security profile that allows the modeler to run correctly.
> [!NOTE]
> Persists across updates


1. **Create the apparmor profile** at `/etc/apparmor.d/cognito-modeler` with this content:
    ```
    abi <abi/4.0>,
    include <tunables/global>
    
    profile cognito-modeler /@{HOME}/path-to-cognito-modeler-executable flags=(unconfined) {
      userns,
    
      include if exists <local/cognito-modeler>
    }
    ```
    **Note:** Replace `/path-to-cognito-modeler-executable` with the actual path to the executable.
    
3. **Reload the AppArmor service** to apply the profile:
    ```bash
    sudo systemctl reload apparmor.service
    ```


#### 2. Fix `chrome-sandbox` Permissions
This is a **temporary** fix that directly changes the sandbox file permissions
> [!NOTE]
> Does NOT persist across updates.


```bash
cd /path-to-cognito-modeler
sudo chown root chrome-sandbox
sudo chmod 4755 chrome-sandbox
```

### Non-Root Solution
#### 3. Disable Sandboxing (**Not Recommended**)
Start the modeler from the command line with the `--no-sandbox` flag.
> [!CAUTION]
> This option disables a key security feature to run the application. Use at your own risk.



```bash
/path-to-cognito-modeler/cognito-modeler --no-sandbox
```

## Other questions?

Head over to [GitHub Issues](https://github.com/finos/fluxnova-modeler/issues) to receive help and support.
