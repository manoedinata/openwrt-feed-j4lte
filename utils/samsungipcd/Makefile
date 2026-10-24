# SPDX-License-Identifier: GPL-2.0-only

include $(TOPDIR)/rules.mk

PKG_NAME:=samsungipcd
PKG_SOURCE_DATE:=2026-10-23
PKG_SOURCE_VERSION:=7165a7481ac1a943f73e32f39e3e2d50e5507d5c
PKG_RELEASE:=5

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/manoedinata/samsungipcd.git
PKG_MIRROR_HASH:=skip

PKG_LICENSE:=GPL-2.0-or-later
PKG_LICENSE_FILES:=COPYING

include $(INCLUDE_DIR)/package.mk

define Package/samsungipcd
  SECTION:=net
  CATEGORY:=Network
  SUBMENU:=WWAN
  TITLE:=AT command proxy for Samsung IPC modems
  URL:=https://github.com/manoedinata/samsungipcd
  DEPENDS:=+libsamsung-ipc +libpthread +coreutils-stdbuf
endef

define Package/samsungipcd/description
  Boots a Samsung IPC (Shannon) modem and serves an AT command port for
  ModemManager on the legacy pty /dev/ptyp0 (ttyp0), with packet data
  on the modem driver's rmnet0. Includes the ModemManager rules that tag
  the ports for the samsungipcd plugin.
endef

define Build/Compile
	$(TARGET_CC) $(TARGET_CPPFLAGS) $(TARGET_CFLAGS) -DPREFIX='"/usr"' \
		`$(PKG_CONFIG) --cflags samsung-ipc` \
		-o $(PKG_BUILD_DIR)/samsungipcd \
		$(PKG_BUILD_DIR)/server.c $(PKG_BUILD_DIR)/ppp_crc.c $(PKG_BUILD_DIR)/samsung-ipc.c \
		$(TARGET_LDFLAGS) -lsamsung-ipc -lpthread
endef

define Package/samsungipcd/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/samsungipcd $(1)/usr/sbin/
	$(INSTALL_DIR) $(1)/usr/libexec
	$(INSTALL_BIN) ./files/samsungipcd-run $(1)/usr/libexec/
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/samsungipcd.init $(1)/etc/init.d/samsungipcd
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./files/samsungipcd.uci-defaults $(1)/etc/uci-defaults/90-samsungipcd-wwan
	$(INSTALL_DIR) $(1)/lib/udev/rules.d
	$(INSTALL_DATA) ./files/77-mm-samsungipcd.rules $(1)/lib/udev/rules.d/
endef

$(eval $(call BuildPackage,samsungipcd))
