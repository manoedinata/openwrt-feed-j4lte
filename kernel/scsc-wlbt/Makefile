# SPDX-License-Identifier: GPL-2.0-only
#
# The Exynos7570 WLBT (WiFi) drivers of the J4: the SCSC maxwell core and
# the SCSC WLAN driver. Their sources come with the exynos7570 target's
# kernel patches (drivers/misc/samsung/scsc, drivers/net/wireless/scsc);
# they are built here, out of tree, because the WLAN driver needs the
# cfg80211 of the mac80211 backports package (the kernel has none).

include $(TOPDIR)/rules.mk
include $(INCLUDE_DIR)/kernel.mk

PKG_NAME:=scsc-wlbt
PKG_RELEASE:=4

PKG_LICENSE:=GPL-2.0-only
PKG_EXTMOD_SUBDIRS:=core wlan
PKG_BUILD_PARALLEL:=1

include $(INCLUDE_DIR)/package.mk

define KernelPackage/scsc-core
  SUBMENU:=Wireless Drivers
  TITLE:=Samsung SCSC maxwell core (Exynos7570 WLBT)
  DEPENDS:=@TARGET_exynos7570
  FILES:= \
	$(PKG_BUILD_DIR)/core/scsc_platform_mif.ko \
	$(PKG_BUILD_DIR)/core/scsc_mx.ko
  AUTOLOAD:=$(call AutoProbe,scsc_platform_mif scsc_mx)
endef

define KernelPackage/scsc-core/description
  Boots and runs the WLBT (WiFi/BT) subsystem of the Exynos7570: firmware
  load, shared memory, mailboxes and panic handling (samsung,scsc_wifibt).
  The firmware is read from the phone's VENDOR partition (kmod-scsc-wlan).
endef

define KernelPackage/scsc-wlan
  SUBMENU:=Wireless Drivers
  TITLE:=Samsung SCSC WLAN driver (Exynos7570 WLBT)
  DEPENDS:=@TARGET_exynos7570 +kmod-scsc-core +kmod-cfg80211
  FILES:=$(PKG_BUILD_DIR)/wlan/scsc_wlan.ko
  AUTOLOAD:=$(call AutoProbe,scsc_wlan)
endef

define KernelPackage/scsc-wlan/description
  Fullmac cfg80211 driver for the WLBT WiFi (S610, 2.4 GHz). Mounts the
  phone's VENDOR (firmware) and EFS (MAC address) partitions read-only at
  boot and keeps the radio on 2.4 GHz.
endef

NOSTDINC_FLAGS := \
	$(KERNEL_NOSTDINC_FLAGS) \
	-I$(PKG_BUILD_DIR)/wlan \
	-I$(STAGING_DIR)/usr/include/mac80211-backport/uapi \
	-I$(STAGING_DIR)/usr/include/mac80211-backport \
	-I$(STAGING_DIR)/usr/include/mac80211/uapi \
	-I$(STAGING_DIR)/usr/include/mac80211 \
	-include backport/autoconf.h \
	-include backport/backport.h

# the J4's choices of the drivers' Kconfig, which the kernel config lacks
define Build/Prepare
	mkdir -p $(PKG_BUILD_DIR)
	$(CP) $(LINUX_DIR)/drivers/misc/samsung/scsc $(PKG_BUILD_DIR)/core
	$(CP) $(LINUX_DIR)/drivers/net/wireless/scsc $(PKG_BUILD_DIR)/wlan
	( \
		echo '#define CONFIG_SCSC_CORE_MODULE 1'; \
		echo '#define CONFIG_SCSC_CORE_CM_MODULE 1'; \
		echo '#define CONFIG_SCSC_PLATFORM_MODULE 1'; \
		echo '#define CONFIG_SCSC_CORE_FW_LOCATION "/lib/firmware/scsc"'; \
		echo '#define CONFIG_SCSC_CORE_TOOL_LOCATION "/system/bin"'; \
		echo '#define CONFIG_SCSC_WLBT_CONFIG_PLATFORM "java_s611"'; \
		echo '#define CONFIG_SCSC_WLAN_MODULE 1'; \
		echo '#define CONFIG_SCSC_WLAN_HIP_SUPPORT_SCATTER_GATHER_API 1'; \
		echo '#define CONFIG_SCSC_WLAN_MAC_ADDRESS_FILENAME "/efs/wifi/.mac.info"'; \
	) > $(PKG_BUILD_DIR)/scsc-config.h
endef

define Build/Compile
	+$(KERNEL_MAKE) $(PKG_JOBS) \
		M="$(PKG_BUILD_DIR)/core" \
		CONFIG_SCSC_CORE=m CONFIG_SCSC_CORE_CM=m CONFIG_SCSC_PLATFORM=m \
		KCFLAGS="-include $(PKG_BUILD_DIR)/scsc-config.h" \
		modules
	+$(KERNEL_MAKE) $(PKG_JOBS) \
		M="$(PKG_BUILD_DIR)/wlan" \
		CONFIG_SCSC_WLAN=m CONFIG_SCSC_WLAN_MAX_INTERFACES=3 \
		NOSTDINC_FLAGS="$(NOSTDINC_FLAGS)" \
		KCFLAGS="-include $(PKG_BUILD_DIR)/scsc-config.h" \
		KBUILD_EXTRA_SYMBOLS="$(filter-out $(PKG_SYMVERS_DIR)/$(PKG_NAME).symvers,$(wildcard $(PKG_SYMVERS_DIR)/*.symvers)) $(PKG_BUILD_DIR)/core/Module.symvers" \
		modules
endef

define KernelPackage/scsc-wlan/install
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/wlbt.init $(1)/etc/init.d/wlbt
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./files/wlbt.uci-defaults $(1)/etc/uci-defaults/90-wlbt-2g
endef

$(eval $(call KernelPackage,scsc-core))
$(eval $(call KernelPackage,scsc-wlan))
