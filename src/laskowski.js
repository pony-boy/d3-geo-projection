import {geoProjection} from "d3-geo";

function laskowskiRaw(lambda, phi) {
  var lambda2 = lambda * lambda, phi2 = phi * phi;
  return [
    lambda * (.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)),
    phi * (1.00384 + lambda2 * (.0802894 + phi2 * -0.02855 + lambda2 *0.000199025) + phi2 * (.0998909 + phi2 * -0.0491032))
  ];
}

laskowskiRaw.invert = function(x, y) {
  var lambda = sign(x) * pi,
      phi = y / 2,
      i = 50;
  do {
    var lambda2 = lambda * lambda,
        phi2 = phi * phi,
        lambdaPhi = lambda * phi,
        fx = lambda * (.975534 + phi2 * (-0.119161 + lambda2 * -0.0143059 + phi2 * -0.0547009)) - x,
        fy = phi * (1.00384 + lambda2 * (.0802894 + phi2 * -0.02855 + lambda2 *0.000199025) + phi2 * (.0998909 + phi2 * -0.0491032)) - y,
        deltaxDeltaLambda =0.975534 - phi2 * (.119161 + 3 * lambda2 *0.0143059 + phi2 *0.0547009),
        deltaxDeltaPhi = -lambdaPhi * (2 *0.119161 + 4 *0.0547009 * phi2 + 2 *0.0143059 * lambda2),
        deltayDeltaLambda = lambdaPhi * (2 *0.0802894 + 4 *0.000199025 * lambda2 + 2 * -0.02855 * phi2),
        deltayDeltaPhi = 1.00384 + lambda2 * (.0802894 +0.000199025 * lambda2) + phi2 * (3 * (.0998909 -0.02855 * lambda2) - 5 *0.0491032 * phi2),
        denominator = deltaxDeltaPhi * deltayDeltaLambda - deltayDeltaPhi * deltaxDeltaLambda,
        deltaLambda = (fy * deltaxDeltaPhi - fx * deltayDeltaPhi) / denominator,
        deltaPhi = (fx * deltayDeltaLambda - fy * deltaxDeltaLambda) / denominator;
    lambda -= deltaLambda, phi -= deltaPhi;
  } while ((Math.abs(deltaLambda) > epsilon || Math.abs(deltaPhi) > epsilon) && --i > 0);
  return i && [lambda, phi];
};

export default function() {
  return geoProjection(laskowskiRaw);
}