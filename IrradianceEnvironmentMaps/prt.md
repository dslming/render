https://www.jianshu.com/p/d8d79401525f

### 一、无阴影漫反射传输（Diffuse Unshadowed Transfer）

$$
L(x, \omega _{o}) = \int _{\Omega} f_{r}(x,\omega _{o},\omega _{i}) L_i(x, \omega _{i}) H(x,\omega _{i}) d\omega _{i}
$$

其中:
- $L(x, \omega _{o})$ 点$x$处沿$\omega_o$方向的出射光
- $L_i(x, \omega _{i})$ 点$x$处沿$\omega_i$方向的入射光
- $f_{r}(x,\omega _{o},\omega _{i})$ 点$x$处 BRDF
- $H(x,\omega _{i}) $ $cos(\theta_i)$ 入射光线垂直方向上的投影


可以提到积分外，公式就变为:
$$
L_{DU}(x) = \frac{\rho_x}{\pi}\int_\Omega L_i(x,\omega_i)max(N_x \cdot \omega_i){\rm d}\omega_i
$$
其中：
- $\rho_x $ 点$x$处的表面反照率（surface albedo）
- $N_x$ 点$x$处的法线
