-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movilizacionesdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(60) NOT NULL,
  `id_registro` varchar(50) NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE','LOGIN') NOT NULL,
  `valor_old` json DEFAULT NULL,
  `valor_new` json DEFAULT NULL,
  `cambiado_por` varchar(100) NOT NULL DEFAULT 'DATABASE',
  `fecha_cambio` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_auditoria_fecha` (`fecha_cambio`),
  KEY `idx_auditoria_tabla` (`tabla_afectada`),
  KEY `idx_auditoria_usuario` (`cambiado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,'vehiculos','TPTP13','INSERT',NULL,'{\"estado\": \"DISPONIBLE\", \"modelo\": \"NISSAN TEST \", \"patente\": \"TPTP13\", \"kms_actual\": 0, \"licencia_min\": \"B\", \"tipo_vehiculo\": \"Camioneta\"}','CONSOLA','2026-07-20 12:08:34'),(2,'usuarios','7','LOGIN',NULL,'{\"cargo\": \"Administrativo\", \"nombre\": \"Administrativo 1\"}','admin@muni.cl','2026-07-20 12:50:26'),(3,'usuarios','31','INSERT',NULL,'{\"cargo\": \"Funcionario\", \"correo\": \"elmio.dom@muni.cl\", \"estado\": 1, \"nombre\": \"EL DOMI\", \"tipo_licencia\": \"\"}','admin@muni.cl','2026-07-20 12:59:52'),(4,'usuarios','7','LOGIN',NULL,'{\"cargo\": \"Administrativo\", \"nombre\": \"Administrativo 1\"}','admin@muni.cl','2026-07-20 15:10:56'),(5,'usuarios','7','LOGIN',NULL,'{\"cargo\": \"Administrativo\", \"nombre\": \"Administrativo 1\"}','admin@muni.cl','2026-07-20 15:25:10'),(6,'vehiculos','asdasd','INSERT',NULL,'{\"estado\": \"DISPONIBLE\", \"modelo\": \"zxc\", \"patente\": \"asdasd\", \"kms_actual\": 0, \"licencia_min\": \"A2\", \"tipo_vehiculo\": \"Bus\"}','admin@muni.cl','2026-07-20 15:32:37'),(7,'viajes','79','INSERT',NULL,'{\"modo\": \"ida\", \"destino\": \"Nancagua, Provincia de Colchagua, Región del Libertador General Bernardo O\'Higgins, Chile\", \"patente\": \"JJVB95\", \"id_usuario\": 29, \"estado_viaje\": \"En espera\"}','admin@muni.cl','2026-07-20 15:39:40'),(8,'usuarios','29','LOGIN',NULL,'{\"cargo\": \"Funcionario\", \"nombre\": \"Pepe Lopez\"}','pepe.lopez@muni.cl','2026-07-20 15:40:03'),(9,'viajes','80','INSERT',NULL,'{\"modo\": \"vuelta\", \"destino\": \"Municipalidad\", \"patente\": \"JJVB95\", \"id_usuario\": 29, \"estado_viaje\": \"En espera\"}','CONSOLA','2026-07-20 15:40:50'),(10,'viajes','80','UPDATE','{\"estado\": \"En espera\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','{\"estado\": \"En espera\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','CONSOLA','2026-07-20 15:46:29'),(11,'viajes','80','UPDATE','{\"estado\": \"En espera\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','{\"estado\": \"En proceso\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','pepe.lopez@muni.cl','2026-07-20 15:46:29'),(12,'usuarios','29','UPDATE','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','CONSOLA','2026-07-20 15:46:29'),(13,'viajes','80','UPDATE','{\"estado\": \"En proceso\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','{\"estado\": \"En proceso\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','CONSOLA','2026-07-20 15:46:58'),(14,'viajes','80','UPDATE','{\"estado\": \"En proceso\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": null, \"fecha_hora_fin\": null}','{\"estado\": \"Terminado\", \"destino\": \"Municipalidad\", \"kms_fin\": 0, \"obs_viaje\": \"asdad\", \"fecha_hora_fin\": \"2026-07-20 15:46:00.000000\"}','pepe.lopez@muni.cl','2026-07-20 15:46:58'),(15,'usuarios','29','UPDATE','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','CONSOLA','2026-07-20 15:46:58'),(16,'usuarios','7','LOGIN',NULL,'{\"cargo\": \"Administrativo\", \"nombre\": \"Administrativo 1\"}','admin@muni.cl','2026-07-20 15:47:17'),(17,'usuarios','7','LOGIN',NULL,'{\"cargo\": \"Administrativo\", \"nombre\": \"Administrativo 1\"}','admin@muni.cl','2026-07-21 12:08:22'),(18,'vehiculos','SKYP73','UPDATE','{\"estado\": \"DISPONIBLE\", \"modelo\": \"Mitsubishi Katana\", \"kms_actual\": 0}','{\"estado\": \"DISPONIBLE\", \"modelo\": \"Mitsubishi Katana\", \"kms_actual\": 0}','admin@muni.cl','2026-07-21 13:05:51'),(19,'usuarios','29','UPDATE','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','{\"cargo\": \"Funcionario\", \"correo\": \"pepe.lopez@muni.cl\", \"estado\": 1, \"nombre\": \"Pepe Lopez\", \"tipo_licencia\": \"\"}','admin@muni.cl','2026-07-21 13:05:51'),(20,'viajes','77','DELETE','{\"estado\": \"En espera\", \"patente\": \"SKYP73\", \"id_usuario\": 29}',NULL,'admin@muni.cl','2026-07-21 13:05:51'),(21,'vehiculos','KRSW96','UPDATE','{\"estado\": \"DISPONIBLE\", \"modelo\": \"Retroexcavadora\", \"kms_actual\": 0}','{\"estado\": \"DISPONIBLE\", \"modelo\": \"Retroexcavadora\", \"kms_actual\": 0}','admin@muni.cl','2026-07-21 13:05:53'),(22,'usuarios','26','UPDATE','{\"cargo\": \"Funcionario\", \"correo\": \"licencia@muni.cl\", \"estado\": 1, \"nombre\": \"licencia test\", \"tipo_licencia\": \"\"}','{\"cargo\": \"Funcionario\", \"correo\": \"licencia@muni.cl\", \"estado\": 1, \"nombre\": \"licencia test\", \"tipo_licencia\": \"\"}','admin@muni.cl','2026-07-21 13:05:53'),(23,'viajes','75','DELETE','{\"estado\": \"En espera\", \"patente\": \"KRSW96\", \"id_usuario\": 26}',NULL,'admin@muni.cl','2026-07-21 13:05:53');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-21 14:16:08
