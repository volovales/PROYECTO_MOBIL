import React from 'react';
import { Text, StyleSheet, View, Image, ScrollView, Button } from 'react-native';

export default function GraficasScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> Gráficas de Finanzas</Text>

      {/* --- Gráfica 1 --- */}
      <Image
        source={{ uri: 'data:image/png;base64,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' }}
        style={styles.graph}
      />
      <Text style={styles.caption}>Ingresos vs Gastos (Mensual)</Text>

      {/* --- Gráfica 2 --- */}
      <Image
        source={{ uri: 'data:image/png;base64,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' }}
        style={styles.graph}
      />
      <Text style={styles.caption}>Distribución de gastos</Text>

      {/* --- Gráfica 3 --- */}
      <Image
        source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASYAAACrCAMAAAD8Q8FaAAAAk1BMVEX///9Ed6ru7u7q6upAdamyt74xbqjX19c9c6h/nMAqaKLJyclMeqtwkrljibT7/P1ojLYaYZ2rvtTI0+L29vbt8vfz8/PQ0NCwsLDi4uK7u7vDw8OoqKi5ubnT09Pf39+fn5+ampp1dXVWgK6Li4uEhISTk5MAU5aFn76Pp8PS2d+/ytd7j7Svv8+NpcGarsa7ytwCweNyAAAGEElEQVR4nO3dAVvaOBzH8ZhwpC7DOi+XpEnalKGcznPe+391R3Hz4JGUPyoU9PfZs2l9Ymm/FMZT2sIYAAAAwM7KcuglOA3IBAAAH4QRInHobCklD3J/nKLgeIzKld+7CWTK8U7UrfJN200gU05lfa0CD203gUw51rHQ8PKpEDKRPGUq8wZeviPxlGnyLefvgZfvSDxlOh+dPRmNln9Hy6/dD74MvHxH4lemoktSTM5u774Wk9vicTY5u7gYIdNvq5lGP2bFfTH+cXv3z8PVzx8/C2T6bSVTcXV/fvk4Lu7vZ1f3dw+Pd8j0bHVrGk9m57PJ5cPj5cPlz/HFLR50z1YznRWjYjQqxuNiXCy+LfAU/mwt0wbItIRMJMhEgkwkyESCTCTIRIJMJMhEgkwkyESCTFkVS5U2THTfI1NO2SYfVTQrb2ci00s2yeiC8rE7hsAazrnuyaSHfnf/MF5mClNb18pU024CW1NWySquGVsWRCYSZCJBJhJkIkEmEmQiQSYSZCJBJhJkIkEmEmQiQSYSZCJBJhJkIkEmEmQiQSYSZCJBJhJkIkEmEmTKSTVTVlRMdRPIlCNCaqKK/Kab2D2TtkwsfotrZrXovnxQ2sk2BOm6Ywh4s/MxBDIk54WJlVVVlK0c4A3/PXiZKbTJOWtM20284kFnWXCaVcYGp0Ko9nmPDkkbprtTeJen8e6eSd5o18oqRn2dFKs+bKY1eAonQSaSXTL9e5U1zMIfzi6ZLsc5xTALfzi7ZJqMcqO+DrPwh4NMJMi0Rs/nG1/hINO6KM2mHyPTGj332JoI5tfYmrbi0TlkImgCMm1nYkybfo5Ma7iMG3+OTKtS7RT+p9uKtz5uvKAqMq0p2eZ9+8hEgkwkyESCTCTIRIJMOVyy6lXXIfhcmVKwoVZR73wdgs+ViXkRY7A+Ml4Jy4UQpu8YAvGbvsxnMuLEvayknIhO8WreTWBryjGJcVOyp5flyESCTCTIRIJMJMhEgkwkyESCTCTIRIJMJMhEgkwkyESCTCTIRLKvTKZmTcWY8+Wce6a2fYTnsdvb1uRYJZmOSjjjZItM2UxGMqGcEKpuNh/mcUL2lUlErbwQQWqnu72lB1qdfRn2KVxLZhVjtSjdYttLx3um57CZhGNqyrS3yVWtmB/vM9j7Z7oocmYvbz6weVzUUtI2oVYb3gY6EnvIlBs1unhx61Wrg6qES5UTlqVPtTXtkOmYccmUes11CD5Xpspz5Z6uQ1AOlul8drHZ7PwQDSgCnz5fh2DrZxmw51P1dU+m/69W0Jfp/1E6O6q4GOTTE15WStciOmv0zp9l8J5b00XuFkeX779dvB0ykSATCTKRIBMJMpEgEwkykSATCTKRIBMJMpGcRCbV7f69Yc5KlzafsrxcFVcy5ZlrqsTtm6JsmPfy3yPPxJxh1jEXpPUquyp8UbByTCsbVHhLkw1OIpN1Ism5Dt4a7rOrIpqqFMFYo6qUH/U6J5GJCcZZyUR3gcUyuyqLLamRYfHQFCXbeM2FNziNTIM77kx/5q2M+ivvc2QafclZndeX7KUBJ58j0yx3g2ujsgs/ere3H5AJmZDpUJlMdMi0nQx7Otf3Y2VqVD1opuyo48rEXFrJlH3p8W3lN2iXLp5lR80oo9ZeEX3NzuuQr5u4EFJ1/siz6tmbR6kdR9l3HLXFu/QE2Fliv45+FFuOqRWaS7ttbwX1SEpRCq77DxwXv/Yf5feiMPneOyzz5o1njTZCTG0pe0rpWtRO6ansnVsUlW66i/s0PWu3UJu6rvvvl7lMSZSNqbIfxJG8EtJUQgphJJOGl/s7etqrIJWrUx2DDD0NdODKRmHz+6U7Ti5m46QLtn+Xq9dhXvcvWIqydsLZFF1m7QMP8trHYF1cDFaLe3F/x7s6fZ18rYxrg6z7HlKtb5x3ftpz8oDwdXujlJ/eBON6b7UNytv+DbNV3Yp/V0n5zE2KuJhLFZRZDPxuTdT9t/kmevFHlOXySjO9T09aMMM1K/seTYshRqXluP7tfzEzzfrP1tBCK625LvMPJS66ncAlK7txrIynfpYMAAAAAJyy/wDBi6jpRfIsygAAAABJRU5ErkJggg==' }}
        style={styles.graph}
      />
      <Text style={styles.caption}>Evolución del saldo</Text>

      {/* --- Botón para volver --- */}
      <View style={{ marginTop: 30 }}>
        <Button title="← Volver al Menú" color="grey" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#222',
  },
  graph: {
    width: '90%',
    height: 220,
    borderRadius: 10,
    marginVertical: 15,
  },
  caption: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
});
