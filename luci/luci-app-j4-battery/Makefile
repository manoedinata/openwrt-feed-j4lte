# SPDX-License-Identifier: Apache-2.0
#
# Battery and charger state from /sys/class/power_supply on the LuCI status
# page (the J4's s2mpu06 fuel gauge and charger).

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI battery status (power_supply class)
LUCI_DEPENDS:=+luci-mod-status
LUCI_PKGARCH:=all

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Hendra Manudinata <manoedinata@gmail.com>

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
