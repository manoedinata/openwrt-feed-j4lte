# SPDX-License-Identifier: GPL-2.0-only

include $(TOPDIR)/rules.mk

PKG_NAME:=libsamsung-ipc
PKG_SOURCE_DATE:=2026-10-23
PKG_SOURCE_VERSION:=bba6a0d5004e777242e27d6cf2287c7ccda2c982
PKG_RELEASE:=2

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/manoedinata/libsamsung-ipc.git
PKG_MIRROR_HASH:=skip

PKG_LICENSE:=GPL-2.0-or-later
PKG_LICENSE_FILES:=COPYING

PKG_FIXUP:=autoreconf
PKG_INSTALL:=1

include $(INCLUDE_DIR)/package.mk

# ipc_device_detect() finds the device by the "Hardware" line of
# /proc/cpuinfo, which arm64 kernels do not have: force the herolte
# (Shannon) profile, the one the J4's modem works with. A header keeps the
# string's quotes away from the configure/make quoting layers.
TARGET_CFLAGS += -include $(PKG_BUILD_DIR)/j4-ipc-device.h

define Build/Prepare
	$(call Build/Prepare/Default)
	echo '#define IPC_DEVICE_NAME "herolte"' > $(PKG_BUILD_DIR)/j4-ipc-device.h
endef

define Package/libsamsung-ipc
  SECTION:=libs
  CATEGORY:=Libraries
  TITLE:=Samsung IPC modem protocol library
  URL:=https://github.com/manoedinata/libsamsung-ipc
  DEPENDS:=+libopenssl
endef

define Package/libsamsung-ipc/description
  Replicant's libsamsung-ipc with packet data support for Shannon (LTE)
  modems, as on the Samsung Galaxy J4.
endef

define Build/InstallDev
	$(INSTALL_DIR) $(1)/usr/include
	$(CP) $(PKG_INSTALL_DIR)/usr/include/* $(1)/usr/include/
	$(INSTALL_DIR) $(1)/usr/lib/pkgconfig
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libsamsung-ipc.so* $(1)/usr/lib/
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/pkgconfig/samsung-ipc.pc $(1)/usr/lib/pkgconfig/
endef

define Package/libsamsung-ipc/install
	$(INSTALL_DIR) $(1)/usr/lib
	$(CP) $(PKG_INSTALL_DIR)/usr/lib/libsamsung-ipc.so.* $(1)/usr/lib/
endef

$(eval $(call BuildPackage,libsamsung-ipc))
