-- MySQL dump 10.13  Distrib 8.0.33, for Linux (aarch64)
--
-- Host: localhost    Database: seal
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `seal`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `seal` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `seal`;

--
-- Table structure for table `seal_cache`
--

DROP TABLE IF EXISTS `seal_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `func` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `tpl` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_cache_category`
--

DROP TABLE IF EXISTS `seal_cache_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cache_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `url` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '#',
  `order` int NOT NULL DEFAULT '0',
  `b_hidden` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_craft`
--

DROP TABLE IF EXISTS `seal_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_filter`
--

DROP TABLE IF EXISTS `seal_filter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_filter` (
  `filter_type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `filter_id` int NOT NULL,
  `desc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`filter_type`,`filter_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_hk_craft`
--

DROP TABLE IF EXISTS `seal_hk_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_hk_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_hk_item`
--

DROP TABLE IF EXISTS `seal_hk_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_hk_item` (
  `id` int NOT NULL,
  `hex` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `b_available` int NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_hk_set_opt`
--

DROP TABLE IF EXISTS `seal_hk_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_hk_set_opt` (
  `id` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_item`
--

DROP TABLE IF EXISTS `seal_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_item` (
  `id` int NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `res82` int NOT NULL,
  `res83` int NOT NULL,
  `b_available` int NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_item_defected`
--

DROP TABLE IF EXISTS `seal_item_defected`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_item_defected` (
  `id` int NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `b_available` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_jp_craft`
--

DROP TABLE IF EXISTS `seal_jp_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_jp_craft` (
  `id` int DEFAULT NULL,
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_jp_item`
--

DROP TABLE IF EXISTS `seal_jp_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_jp_item` (
  `id` int NOT NULL,
  `hex` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `b_available` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_jp_set_opt`
--

DROP TABLE IF EXISTS `seal_jp_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_jp_set_opt` (
  `id` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_log`
--

DROP TABLE IF EXISTS `seal_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `controller` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `action` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `msg` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `public_msg` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `user_id` int NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type_id` (`controller`)
) ENGINE=MyISAM AUTO_INCREMENT=6869 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_map`
--

DROP TABLE IF EXISTS `seal_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_monster`
--

DROP TABLE IF EXISTS `seal_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_monster` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `res6` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `res12` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_monster_filter`
--

DROP TABLE IF EXISTS `seal_monster_filter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_monster_filter` (
  `monster_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`monster_id`),
  KEY `type_id` (`user_id`,`monster_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_my_craft`
--

DROP TABLE IF EXISTS `seal_my_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_my_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_my_item`
--

DROP TABLE IF EXISTS `seal_my_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_my_item` (
  `id` int NOT NULL,
  `hex` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `b_available` int NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_my_set_opt`
--

DROP TABLE IF EXISTS `seal_my_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_my_set_opt` (
  `id` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_quest`
--

DROP TABLE IF EXISTS `seal_quest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_quest` (
  `quest_id` int DEFAULT NULL,
  `node_id` int DEFAULT NULL,
  `need_item1` int DEFAULT NULL,
  `need_itemnum1` int DEFAULT NULL,
  `need_item2` int DEFAULT NULL,
  `need_itemnum2` int DEFAULT NULL,
  `need_record` int DEFAULT NULL,
  `need_job` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `need_fame` int DEFAULT NULL,
  `need_level` int DEFAULT NULL,
  `need_sex` int DEFAULT NULL,
  `need_money` int DEFAULT NULL,
  `need_time` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `option` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `words` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `task_id` int DEFAULT NULL,
  `result_item1` int DEFAULT NULL,
  `result_itemnum1` int DEFAULT NULL,
  `result_item2` int DEFAULT NULL,
  `result_itemnum2` int DEFAULT NULL,
  `result_item3` int DEFAULT NULL,
  `result_itemnum3` int DEFAULT NULL,
  `result_record` int DEFAULT NULL,
  `result_money` int DEFAULT NULL,
  `result_exp` int DEFAULT NULL,
  `result_fame` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `res27` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `result_position` int DEFAULT NULL,
  `result_job` int DEFAULT NULL,
  `result_skill` int DEFAULT NULL,
  `result_relive` int DEFAULT NULL,
  KEY `quest_id` (`quest_id`,`node_id`),
  KEY `result_record` (`result_record`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_quest_flag`
--

DROP TABLE IF EXISTS `seal_quest_flag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_quest_flag` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `res0` int DEFAULT NULL,
  `res1` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_rel`
--

DROP TABLE IF EXISTS `seal_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_rel` (
  `rel_type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `a_id` int NOT NULL DEFAULT '0',
  `b_id` int NOT NULL DEFAULT '0',
  `desc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`rel_type`,`a_id`,`b_id`),
  KEY `rel_type` (`rel_type`,`b_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_rel_bak`
--

DROP TABLE IF EXISTS `seal_rel_bak`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_rel_bak` (
  `rel_type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `a_id` int NOT NULL,
  `b_id` int NOT NULL,
  `desc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  KEY `rel_type` (`rel_type`,`a_id`),
  KEY `rel_type_2` (`rel_type`,`b_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_rel_item_monster`
--

DROP TABLE IF EXISTS `seal_rel_item_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_rel_item_monster` (
  `item_id` int NOT NULL DEFAULT '0',
  `monster_id` int NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`item_id`,`monster_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_rel_map_monster`
--

DROP TABLE IF EXISTS `seal_rel_map_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_rel_map_monster` (
  `map_id` int NOT NULL,
  `monster_id` int NOT NULL,
  `desc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`map_id`,`monster_id`),
  KEY `monster_id` (`monster_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_rel_user_role`
--

DROP TABLE IF EXISTS `seal_rel_user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_rel_user_role` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_role`
--

DROP TABLE IF EXISTS `seal_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `rolename` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_seller`
--

DROP TABLE IF EXISTS `seal_seller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_seller` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `res1` int DEFAULT NULL,
  `res2` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `res4` int DEFAULT NULL,
  `res5` int DEFAULT NULL,
  `res6` int DEFAULT NULL,
  `res7` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `res9` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  `res12` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `res16` int DEFAULT NULL,
  `res17` int DEFAULT NULL,
  `res18` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `res27` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_set_opt`
--

DROP TABLE IF EXISTS `seal_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_set_opt` (
  `id` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_skill`
--

DROP TABLE IF EXISTS `seal_skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_skill` (
  `level` int NOT NULL DEFAULT '0',
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `job` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `needskill` int DEFAULT NULL,
  `needskilllevel` int DEFAULT NULL,
  `maxlevel` int DEFAULT NULL,
  `point` int DEFAULT NULL,
  `needlevel` int DEFAULT NULL,
  `res7` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `type2` int DEFAULT NULL,
  `range` int DEFAULT NULL,
  `distant` int DEFAULT NULL,
  `res14` double DEFAULT NULL,
  `res15` double DEFAULT NULL,
  `cd` double DEFAULT NULL,
  `combo` int DEFAULT NULL,
  `power` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` double DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `res27` int DEFAULT NULL,
  `res28` double DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `res30` int DEFAULT NULL,
  `res31` double DEFAULT NULL,
  `res32` int DEFAULT NULL,
  `res33` int DEFAULT NULL,
  `ico` int DEFAULT NULL,
  `res35` int DEFAULT NULL,
  `res36` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`,`level`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_craft`
--

DROP TABLE IF EXISTS `seal_tw2_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_craft` (
  `id` int DEFAULT NULL,
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_item`
--

DROP TABLE IF EXISTS `seal_tw2_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_item` (
  `id` int NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `res82` int NOT NULL,
  `res83` int NOT NULL,
  `b_available` int NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_monster`
--

DROP TABLE IF EXISTS `seal_tw2_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_monster` (
  `id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `res6` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `res12` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_set_opt`
--

DROP TABLE IF EXISTS `seal_tw2_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_set_opt` (
  `id` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_craft`
--

DROP TABLE IF EXISTS `seal_tw_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_item`
--

DROP TABLE IF EXISTS `seal_tw_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_item` (
  `id` int NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `b_available` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_set_opt`
--

DROP TABLE IF EXISTS `seal_tw_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_set_opt` (
  `id` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_craft`
--

DROP TABLE IF EXISTS `seal_us_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_craft` (
  `id` int DEFAULT NULL,
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `assistnum` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_item`
--

DROP TABLE IF EXISTS `seal_us_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_item` (
  `id` int NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` int NOT NULL,
  `level` int NOT NULL,
  `level_step` int NOT NULL,
  `fame` int NOT NULL,
  `attack` int NOT NULL,
  `task_res1` int NOT NULL,
  `attack_step` int NOT NULL,
  `demageinc` int NOT NULL,
  `task_fame` int NOT NULL,
  `pet_res1` int NOT NULL,
  `magic` int NOT NULL,
  `task_res2` int NOT NULL,
  `magic_step` int NOT NULL,
  `res8` int NOT NULL,
  `weapon_res1` int NOT NULL,
  `defense` int NOT NULL,
  `res10` int NOT NULL,
  `defense_step` int NOT NULL,
  `demagedec` int NOT NULL,
  `equip_res1` int NOT NULL,
  `pet_res2` int NOT NULL,
  `attackspeed` int NOT NULL,
  `type_res1` int NOT NULL,
  `accuracy` int NOT NULL,
  `res16` int NOT NULL,
  `critical` int NOT NULL,
  `res18` int NOT NULL,
  `evade` int NOT NULL,
  `res20` int NOT NULL,
  `movespeed` int NOT NULL,
  `res22` int NOT NULL,
  `setid` int NOT NULL,
  `propid` int NOT NULL,
  `buyprice` int NOT NULL,
  `sellprice` int NOT NULL,
  `cure_hp` int NOT NULL,
  `res26` int NOT NULL,
  `cure_ap` int NOT NULL,
  `res28` int NOT NULL,
  `res29` int NOT NULL,
  `cd` int NOT NULL,
  `petpoint` int NOT NULL,
  `res32` int NOT NULL,
  `pt` int NOT NULL,
  `g_type` int NOT NULL,
  `needpt` int NOT NULL,
  `convertid` int NOT NULL,
  `fishingid` int NOT NULL,
  `res38` int NOT NULL,
  `g_item` int NOT NULL,
  `t_item` int NOT NULL,
  `s_item` int NOT NULL,
  `c_item` int NOT NULL,
  `res43` int NOT NULL,
  `res44` int NOT NULL,
  `attackrange` int NOT NULL,
  `needstrength` int NOT NULL,
  `needstrength_step` double NOT NULL,
  `needagile` int NOT NULL,
  `needagile_step` double NOT NULL,
  `needint` int NOT NULL,
  `needint_step` double NOT NULL,
  `needvit` int NOT NULL,
  `needvit_step` double NOT NULL,
  `needwisdom` int NOT NULL,
  `needwisdom_step` double NOT NULL,
  `needluck` int NOT NULL,
  `needluck_step` double NOT NULL,
  `posid` int NOT NULL,
  `jobid` int NOT NULL,
  `res56` int NOT NULL,
  `displayid` int NOT NULL,
  `glevel` int NOT NULL,
  `type_res2` int NOT NULL,
  `minutes` int NOT NULL,
  `setid2` int NOT NULL,
  `res62` int NOT NULL,
  `res63` int NOT NULL,
  `res64` int NOT NULL,
  `vip_type` int NOT NULL,
  `vip_value` int NOT NULL,
  `vip_time` int NOT NULL,
  `res82` int NOT NULL,
  `res83` int NOT NULL,
  `b_available` int NOT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_monster`
--

DROP TABLE IF EXISTS `seal_us_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_monster` (
  `id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `res6` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `res12` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_quest`
--

DROP TABLE IF EXISTS `seal_us_quest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_quest` (
  `quest_id` int DEFAULT NULL,
  `node_id` int DEFAULT NULL,
  `need_item1` int DEFAULT NULL,
  `need_itemnum1` int DEFAULT NULL,
  `need_item2` int DEFAULT NULL,
  `need_itemnum2` int DEFAULT NULL,
  `need_record` int DEFAULT NULL,
  `need_job` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `need_fame` int DEFAULT NULL,
  `need_level` int DEFAULT NULL,
  `need_sex` int DEFAULT NULL,
  `need_money` int DEFAULT NULL,
  `need_time` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `option` varchar(64) DEFAULT NULL,
  `words` longtext,
  `task_id` int DEFAULT NULL,
  `result_item1` int DEFAULT NULL,
  `result_itemnum1` int DEFAULT NULL,
  `result_item2` int DEFAULT NULL,
  `result_itemnum2` int DEFAULT NULL,
  `result_item3` int DEFAULT NULL,
  `result_itemnum3` int DEFAULT NULL,
  `result_record` int DEFAULT NULL,
  `result_money` int DEFAULT NULL,
  `result_exp` int DEFAULT NULL,
  `result_fame` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `res27` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `result_position` int DEFAULT NULL,
  `result_job` int DEFAULT NULL,
  `result_skill` int DEFAULT NULL,
  `result_relive` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_rel_item_monster`
--

DROP TABLE IF EXISTS `seal_us_rel_item_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_rel_item_monster` (
  `item_id` int NOT NULL DEFAULT '0',
  `monster_id` int NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`item_id`,`monster_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_set_opt`
--

DROP TABLE IF EXISTS `seal_us_set_opt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_set_opt` (
  `id` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_user`
--

DROP TABLE IF EXISTS `seal_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `password` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `email` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `test0.1`
--

DROP TABLE IF EXISTS `test0.1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test0.1` (
  `id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Current Database: `seal-v2`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `seal-v2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `seal-v2`;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `avator` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `weibo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `google` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `facebook` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `weibo` (`weibo`),
  KEY `google` (`google`),
  KEY `facebook` (`facebook`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_cn_craft`
--

DROP TABLE IF EXISTS `seal_cn_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cn_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `fee` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `fieldnum` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `resultnum` int DEFAULT NULL,
  `mix` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `needitem` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_cn_item`
--

DROP TABLE IF EXISTS `seal_cn_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cn_item` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `level_step` int DEFAULT NULL,
  `fame` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `task_res1` int DEFAULT NULL,
  `attack_step` int DEFAULT NULL,
  `demageinc` int DEFAULT NULL,
  `task_fame` int DEFAULT NULL,
  `pet_res1` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `task_money` int DEFAULT NULL,
  `magic_step` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `weapon_res1` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `defense_step` int DEFAULT NULL,
  `demagedec` int DEFAULT NULL,
  `equip_res1` int DEFAULT NULL,
  `pet_res2` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `type_res1` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `res16` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `res18` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `setid` int DEFAULT NULL,
  `propid` int DEFAULT NULL,
  `buyprice` int DEFAULT NULL,
  `sellprice` int DEFAULT NULL,
  `cure_hp` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `cure_ap` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `cd` int DEFAULT NULL,
  `petpoint` int DEFAULT NULL,
  `res32` int DEFAULT NULL,
  `pt` int DEFAULT NULL,
  `g_type` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `convertid` int DEFAULT NULL,
  `fishingid` int DEFAULT NULL,
  `res38` int DEFAULT NULL,
  `g_item` int DEFAULT NULL,
  `t_item` int DEFAULT NULL,
  `s_item` int DEFAULT NULL,
  `c_item` int DEFAULT NULL,
  `res43` int DEFAULT NULL,
  `res44` int DEFAULT NULL,
  `attackrange` int DEFAULT NULL,
  `needstrength` int DEFAULT NULL,
  `needstrength_step` double DEFAULT NULL,
  `needagile` int DEFAULT NULL,
  `needagile_step` double DEFAULT NULL,
  `needint` int DEFAULT NULL,
  `needint_step` double DEFAULT NULL,
  `needvit` int DEFAULT NULL,
  `needvit_step` double DEFAULT NULL,
  `needwisdom` int DEFAULT NULL,
  `needwisdom_step` double DEFAULT NULL,
  `needluck` int DEFAULT NULL,
  `needluck_step` double DEFAULT NULL,
  `posid` int DEFAULT NULL,
  `jobid` int DEFAULT NULL,
  `res56` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `glevel` int DEFAULT NULL,
  `type_res2` int DEFAULT NULL,
  `minutes` int DEFAULT NULL,
  `setid2` int DEFAULT NULL,
  `res62` int DEFAULT NULL,
  `res63` int DEFAULT NULL,
  `res64` int DEFAULT NULL,
  `vip_type` int DEFAULT NULL,
  `vip_value` int DEFAULT NULL,
  `vip_time` int DEFAULT NULL,
  `res82` int DEFAULT NULL,
  `res83` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_cn_monster`
--

DROP TABLE IF EXISTS `seal_cn_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cn_monster` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `sight` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `dropid` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_cn_setopt`
--

DROP TABLE IF EXISTS `seal_cn_setopt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_cn_setopt` (
  `id` int NOT NULL DEFAULT '0',
  `count` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`,`count`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_notice`
--

DROP TABLE IF EXISTS `seal_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_notice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` int DEFAULT NULL,
  `type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `content` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `time` (`time`),
  KEY `type` (`type`)
) ENGINE=MyISAM AUTO_INCREMENT=294 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_relation`
--

DROP TABLE IF EXISTS `seal_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_relation` (
  `type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `a` int NOT NULL DEFAULT '0',
  `b` int NOT NULL DEFAULT '0',
  `value` int DEFAULT NULL,
  `desc` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`type`,`a`,`b`),
  KEY `type` (`type`,`a`),
  KEY `type_2` (`type`,`b`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_craft`
--

DROP TABLE IF EXISTS `seal_tw2_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `fee` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `fieldnum` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `resultnum` int DEFAULT NULL,
  `mix` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `needitem` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_item`
--

DROP TABLE IF EXISTS `seal_tw2_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_item` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `level_step` int DEFAULT NULL,
  `fame` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `task_res1` int DEFAULT NULL,
  `attack_step` int DEFAULT NULL,
  `demageinc` int DEFAULT NULL,
  `task_fame` int DEFAULT NULL,
  `pet_res1` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `task_money` int DEFAULT NULL,
  `magic_step` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `weapon_res1` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `defense_step` int DEFAULT NULL,
  `demagedec` int DEFAULT NULL,
  `equip_res1` int DEFAULT NULL,
  `pet_res2` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `type_res1` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `res16` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `res18` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `setid` int DEFAULT NULL,
  `propid` int DEFAULT NULL,
  `buyprice` int DEFAULT NULL,
  `sellprice` int DEFAULT NULL,
  `cure_hp` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `cure_ap` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `cd` int DEFAULT NULL,
  `petpoint` int DEFAULT NULL,
  `res32` int DEFAULT NULL,
  `pt` int DEFAULT NULL,
  `g_type` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `convertid` int DEFAULT NULL,
  `fishingid` int DEFAULT NULL,
  `res38` int DEFAULT NULL,
  `g_item` int DEFAULT NULL,
  `t_item` int DEFAULT NULL,
  `s_item` int DEFAULT NULL,
  `c_item` int DEFAULT NULL,
  `res43` int DEFAULT NULL,
  `res44` int DEFAULT NULL,
  `attackrange` int DEFAULT NULL,
  `needstrength` int DEFAULT NULL,
  `needstrength_step` double DEFAULT NULL,
  `needagile` int DEFAULT NULL,
  `needagile_step` double DEFAULT NULL,
  `needint` int DEFAULT NULL,
  `needint_step` double DEFAULT NULL,
  `needvit` int DEFAULT NULL,
  `needvit_step` double DEFAULT NULL,
  `needwisdom` int DEFAULT NULL,
  `needwisdom_step` double DEFAULT NULL,
  `needluck` int DEFAULT NULL,
  `needluck_step` double DEFAULT NULL,
  `posid` int DEFAULT NULL,
  `jobid` int DEFAULT NULL,
  `res56` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `glevel` int DEFAULT NULL,
  `type_res2` int DEFAULT NULL,
  `minutes` int DEFAULT NULL,
  `setid2` int DEFAULT NULL,
  `res62` int DEFAULT NULL,
  `res63` int DEFAULT NULL,
  `res64` int DEFAULT NULL,
  `vip_type` int DEFAULT NULL,
  `vip_value` int DEFAULT NULL,
  `vip_time` int DEFAULT NULL,
  `res82` int DEFAULT NULL,
  `res83` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_monster`
--

DROP TABLE IF EXISTS `seal_tw2_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_monster` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `sight` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `dropid` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_setopt`
--

DROP TABLE IF EXISTS `seal_tw2_setopt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_setopt` (
  `id` int NOT NULL DEFAULT '0',
  `count` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`,`count`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw2_setopt_0.801`
--

DROP TABLE IF EXISTS `seal_tw2_setopt_0.801`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw2_setopt_0.801` (
  `id` int DEFAULT NULL,
  `count` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_craft`
--

DROP TABLE IF EXISTS `seal_tw_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `fee` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `fieldnum` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `resultnum` int DEFAULT NULL,
  `mix` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `needitem` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_item`
--

DROP TABLE IF EXISTS `seal_tw_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_item` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `level_step` int DEFAULT NULL,
  `fame` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `task_res1` int DEFAULT NULL,
  `attack_step` int DEFAULT NULL,
  `demageinc` int DEFAULT NULL,
  `task_fame` int DEFAULT NULL,
  `pet_res1` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `task_money` int DEFAULT NULL,
  `magic_step` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `weapon_res1` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `defense_step` int DEFAULT NULL,
  `demagedec` int DEFAULT NULL,
  `equip_res1` int DEFAULT NULL,
  `pet_res2` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `type_res1` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `res16` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `res18` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `setid` int DEFAULT NULL,
  `propid` int DEFAULT NULL,
  `buyprice` int DEFAULT NULL,
  `sellprice` int DEFAULT NULL,
  `cure_hp` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `cure_ap` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `cd` int DEFAULT NULL,
  `petpoint` int DEFAULT NULL,
  `res32` int DEFAULT NULL,
  `pt` int DEFAULT NULL,
  `g_type` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `convertid` int DEFAULT NULL,
  `fishingid` int DEFAULT NULL,
  `res38` int DEFAULT NULL,
  `g_item` int DEFAULT NULL,
  `t_item` int DEFAULT NULL,
  `s_item` int DEFAULT NULL,
  `c_item` int DEFAULT NULL,
  `res43` int DEFAULT NULL,
  `res44` int DEFAULT NULL,
  `attackrange` int DEFAULT NULL,
  `needstrength` int DEFAULT NULL,
  `needstrength_step` double DEFAULT NULL,
  `needagile` int DEFAULT NULL,
  `needagile_step` double DEFAULT NULL,
  `needint` int DEFAULT NULL,
  `needint_step` double DEFAULT NULL,
  `needvit` int DEFAULT NULL,
  `needvit_step` double DEFAULT NULL,
  `needwisdom` int DEFAULT NULL,
  `needwisdom_step` double DEFAULT NULL,
  `needluck` int DEFAULT NULL,
  `needluck_step` double DEFAULT NULL,
  `posid` int DEFAULT NULL,
  `jobid` int DEFAULT NULL,
  `res56` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `glevel` int DEFAULT NULL,
  `type_res2` int DEFAULT NULL,
  `minutes` int DEFAULT NULL,
  `setid2` int DEFAULT NULL,
  `res62` int DEFAULT NULL,
  `res63` int DEFAULT NULL,
  `res64` int DEFAULT NULL,
  `vip_type` int DEFAULT NULL,
  `vip_value` int DEFAULT NULL,
  `vip_time` int DEFAULT NULL,
  `res82` int DEFAULT NULL,
  `res83` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_monster`
--

DROP TABLE IF EXISTS `seal_tw_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_monster` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `sight` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `dropid` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_tw_setopt`
--

DROP TABLE IF EXISTS `seal_tw_setopt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_tw_setopt` (
  `id` int NOT NULL DEFAULT '0',
  `count` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`,`count`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_craft`
--

DROP TABLE IF EXISTS `seal_us_craft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_craft` (
  `id` int NOT NULL DEFAULT '0',
  `res0` int DEFAULT NULL,
  `skilllevel` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `fee` int DEFAULT NULL,
  `rate` int DEFAULT NULL,
  `fieldnum` int DEFAULT NULL,
  `result` int DEFAULT NULL,
  `resultnum` int DEFAULT NULL,
  `mix` int DEFAULT NULL,
  `type` int DEFAULT NULL,
  `needitem` int DEFAULT NULL,
  `needitemlevel` int DEFAULT NULL,
  `need1` int DEFAULT NULL,
  `num1` int DEFAULT NULL,
  `need2` int DEFAULT NULL,
  `num2` int DEFAULT NULL,
  `need3` int DEFAULT NULL,
  `num3` int DEFAULT NULL,
  `need4` int DEFAULT NULL,
  `num4` int DEFAULT NULL,
  `need5` int DEFAULT NULL,
  `num5` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_item`
--

DROP TABLE IF EXISTS `seal_us_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_item` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `type` int DEFAULT NULL,
  `level` int DEFAULT NULL,
  `level_step` int DEFAULT NULL,
  `fame` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `task_res1` int DEFAULT NULL,
  `attack_step` int DEFAULT NULL,
  `demageinc` int DEFAULT NULL,
  `task_fame` int DEFAULT NULL,
  `pet_res1` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `task_money` int DEFAULT NULL,
  `magic_step` int DEFAULT NULL,
  `res8` int DEFAULT NULL,
  `weapon_res1` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `defense_step` int DEFAULT NULL,
  `demagedec` int DEFAULT NULL,
  `equip_res1` int DEFAULT NULL,
  `pet_res2` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `type_res1` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `res16` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `res18` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `setid` int DEFAULT NULL,
  `propid` int DEFAULT NULL,
  `buyprice` int DEFAULT NULL,
  `sellprice` int DEFAULT NULL,
  `cure_hp` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  `cure_ap` int DEFAULT NULL,
  `res28` int DEFAULT NULL,
  `res29` int DEFAULT NULL,
  `cd` int DEFAULT NULL,
  `petpoint` int DEFAULT NULL,
  `res32` int DEFAULT NULL,
  `pt` int DEFAULT NULL,
  `g_type` int DEFAULT NULL,
  `needpt` int DEFAULT NULL,
  `convertid` int DEFAULT NULL,
  `fishingid` int DEFAULT NULL,
  `res38` int DEFAULT NULL,
  `g_item` int DEFAULT NULL,
  `t_item` int DEFAULT NULL,
  `s_item` int DEFAULT NULL,
  `c_item` int DEFAULT NULL,
  `res43` int DEFAULT NULL,
  `res44` int DEFAULT NULL,
  `attackrange` int DEFAULT NULL,
  `needstrength` int DEFAULT NULL,
  `needstrength_step` double DEFAULT NULL,
  `needagile` int DEFAULT NULL,
  `needagile_step` double DEFAULT NULL,
  `needint` int DEFAULT NULL,
  `needint_step` double DEFAULT NULL,
  `needvit` int DEFAULT NULL,
  `needvit_step` double DEFAULT NULL,
  `needwisdom` int DEFAULT NULL,
  `needwisdom_step` double DEFAULT NULL,
  `needluck` int DEFAULT NULL,
  `needluck_step` double DEFAULT NULL,
  `posid` int DEFAULT NULL,
  `jobid` int DEFAULT NULL,
  `res56` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `glevel` int DEFAULT NULL,
  `type_res2` int DEFAULT NULL,
  `minutes` int DEFAULT NULL,
  `setid2` int DEFAULT NULL,
  `res62` int DEFAULT NULL,
  `res63` int DEFAULT NULL,
  `res64` int DEFAULT NULL,
  `vip_type` int DEFAULT NULL,
  `vip_value` int DEFAULT NULL,
  `vip_time` int DEFAULT NULL,
  `res82` int DEFAULT NULL,
  `res83` int DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  FULLTEXT KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_monster`
--

DROP TABLE IF EXISTS `seal_us_monster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_monster` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `level` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `res3` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `property` int DEFAULT NULL,
  `sight` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `attack` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `exp` int DEFAULT NULL,
  `dropid` int DEFAULT NULL,
  `res13` int DEFAULT NULL,
  `res14` int DEFAULT NULL,
  `res15` int DEFAULT NULL,
  `displayid` int DEFAULT NULL,
  `questid` int DEFAULT NULL,
  `sellid` int DEFAULT NULL,
  `res19` int DEFAULT NULL,
  `res20` int DEFAULT NULL,
  `res21` int DEFAULT NULL,
  `res22` int DEFAULT NULL,
  `res23` int DEFAULT NULL,
  `res24` int DEFAULT NULL,
  `res25` int DEFAULT NULL,
  `res26` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_us_setopt`
--

DROP TABLE IF EXISTS `seal_us_setopt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_us_setopt` (
  `id` int NOT NULL DEFAULT '0',
  `count` int NOT NULL DEFAULT '0',
  `attack` int DEFAULT NULL,
  `magic` int DEFAULT NULL,
  `defense` int DEFAULT NULL,
  `attackspeed` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `critical` int DEFAULT NULL,
  `evade` int DEFAULT NULL,
  `movespeed` int DEFAULT NULL,
  `hp` int DEFAULT NULL,
  `ap` int DEFAULT NULL,
  `res10` int DEFAULT NULL,
  `res11` int DEFAULT NULL,
  PRIMARY KEY (`id`,`count`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seal_version`
--

DROP TABLE IF EXISTS `seal_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seal_version` (
  `loc` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `type` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT '',
  `version` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `time` int DEFAULT NULL,
  PRIMARY KEY (`loc`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-23  5:55:46
