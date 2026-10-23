# OpenWrt feed for the Samsung Galaxy J4 (SM-J400F, Exynos7570)

Packages for mobile data on the J4's Shannon modem under OpenWrt 25.12,
used together with the `exynos7570` target in
[manoedinata/openwrt](https://github.com/manoedinata/openwrt) (branch
`j4lte-25.12`).

| package | |
| --- | --- |
| `libs/libsamsung-ipc` | Samsung IPC protocol library with Shannon (LTE) packet data |
| `utils/samsungipcd` | boots the modem, serves an AT port on `/dev/ptyp0` (`ttyp0`) for ModemManager, data on `rmnet0`; procd service, ModemManager rules, a `wwan` interface on first boot |
| `net/modemmanager` | OpenWrt's ModemManager 1.24 package plus the `samsungipcd` plugin (`patches/0100-plugins-add-samsungipcd.patch`) and a default route for gateway-less point-to-point bearers |

Use it in an OpenWrt tree with

    src-git j4 https://github.com/manoedinata/openwrt-feed-j4lte.git

in `feeds.conf`, then `./scripts/feeds update j4` and
`./scripts/feeds install -p j4 -f -a` (`-f` so that this `modemmanager`
replaces the one from the packages feed).
