---
marp: true
theme: thws-pr
paginate: true
header: '**Risk: An Introduction** <br> Prof. Dr. Christian Kraus'
math: mathjax
---

<!-- _class: titlepage -->

# Portfolio Theory and Diversification
## Is Diversification a Free Lunch?

---

<!-- _class: center -->

# <!-- fit --> "Diversification is the only free lunch in finance."

<!--
Moderation (approx. 12 min total, slides 2-4): No agenda, no learning objectives. Start immediately. Show of hands: Who agrees? The sentence is often attributed to Markowitz; treat it as a popular saying, not as a verified quotation.
Learning goals (for the lecturer): calculate portfolio return and risk, explain the role of correlation, distinguish systematic and unsystematic risk, apply the Sharpe ratio, describe the efficient frontier.
-->

---

<!-- _class: structural -->

# Your Estimate

Two assets:

| | Expected return | Risk (std. dev.) |
|---|---|---|
| **A** | 5% | 3% |
| **B** | 10% | 9% |

You invest **40% in A and 60% in B.** The two assets are **uncorrelated.**

The weighted average of the two risks is **6.6%.**

**Show of hands:** Is the portfolio's risk **below**, **equal to** or **above** 6.6%?

---

# The Answer: 5.53%

$$\mu_p = 0.4 \cdot 5\% + 0.6 \cdot 10\% = \mathbf{8\%}$$

$$\sigma_p = \sqrt{0.4^2 \cdot 0.03^2 + 0.6^2 \cdot 0.09^2} = \sqrt{0.00306} = \mathbf{5.53\%}$$

- The portfolio earns **8%** at **5.53%** risk
- The **weighted average** of the risks is 6.6%
- The gap of **1.07 percentage points** is the diversification benefit

→ **Risk does not average, return does.**

---

# Why Is the Portfolio Calmer?

An **airline** and an **oil company:** When oil gets expensive, the oil company profits and the airline suffers. When oil gets cheap, it is the other way round.

Neither stock is safe alone. Together they **partly cancel out.**

The **correlation** $\rho$ measures how much two assets move in lockstep:

$$\rho_{AB} = \frac{\operatorname{Cov}(R_A, R_B)}{\sigma_A \, \sigma_B} \qquad -1 \le \rho \le +1$$

→ The less in lockstep, the stronger the cancelling.

---

# The Formula: One Extra Term

$$\sigma_p^2 = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + \underbrace{2\, w_A w_B\, \rho_{AB}\, \sigma_A \sigma_B}_{\text{the diversification term}}$$

- With $\rho = 0$ the last term **vanishes**, which is what we did on the last slide
- With $\rho = +1$ it becomes largest: **no diversification benefit**
- With $\rho < 0$ it **reduces** the risk even further

→ **Everything in portfolio theory is about this term.**

---

<!-- _class: tiny-text -->

# Correlation Changes Everything

Same assets, same weights (40% A / 60% B). Only $\rho$ varies:

| Correlation $\rho$ | Variance | Risk $\sigma_p$ |
|---|---|---|
| **+1.0** | 0.004356 | **6.60%** (no benefit) |
| +0.5 | 0.003708 | 6.09% |
| 0.0 | 0.003060 | 5.53% |
| −0.5 | 0.002412 | 4.91% |
| **−1.0** | 0.001764 | **4.20%** |

→ $\sigma_p^2 = 0.00306 + 0.001296 \cdot \rho$. Return stays at **8%** throughout.

*Live demo: open the widget "Correlation Impact Visualizer" and move $\rho$.*

---

<!-- _class: structural -->

# Exercise: How Low Can You Go?

Same assets A and B, weights 40% / 60%. You want the portfolio risk **below 5%.**

**Groups (5 minutes):**

1. Which **correlation** do you need? (Use $\sigma_p^2 = 0.00306 + 0.001296\,\rho$)
2. With $\rho = -1$: Which **weights** give a portfolio with **zero** risk?
3. Is such a pair of assets easy to find in practice? Why not?

*One answer and one sentence of reasoning per group.*

<!--
Expected: 1 -- sigma^2 < 0.0025 => rho < (0.0025 - 0.00306)/0.001296 = -0.43. 2 -- w_A = sigma_B / (sigma_A + sigma_B) = 9/12 = 75%, w_B = 25%: |0.75*3% - 0.25*9%| = 0. 3 -- Perfect negative correlation does not occur in real markets; correlations of stocks are typically clearly positive.
-->

---

# The Floor: Systematic Risk

Adding more assets lowers risk, but **not to zero:**

- **Unsystematic** (specific) risk: management errors, product failures, strikes. **Diversifiable.**
- **Systematic** (market) risk: recessions, interest rates, geopolitics. **Not diversifiable.**

For $n$ identical assets with correlation $\rho$ and equal weights:

$$\sigma_p^2 = \sigma^2\left(\tfrac{1}{n} + \rho\,\tfrac{n-1}{n}\right) \;\xrightarrow{n \to \infty}\; \rho\,\sigma^2$$

→ With $\rho = 0.3$ the variance floors at **30%** of a single stock's variance (risk: about 55%). The market **does not pay** for risk you can diversify away for free.

*Live demo: widget "Diversification Benefit Calculator".*

<!--
Rule of thumb often quoted: 20-30 stocks capture most of the benefit; later studies argue for more. Check the source before quoting numbers to students.
-->

---

<!-- _class: structural -->

# Exercise: Which Portfolio?

Risk-free rate: **3%.**

| Portfolio | Expected return | Risk |
|---|---|---|
| **X** | 12% | 15% |
| **Y** | 9% | 8% |

**Groups (5 minutes):**

1. Which portfolio offers more **excess return per unit of risk**?
2. Can you reach **X's 12% with less risk** using Y? How?

<!--
Expected: 1 -- Sharpe = (mu - rf)/sigma: X = 9/15 = 0.60, Y = 6/8 = 0.75, so Y. 2 -- Leverage Y with L = 1.5 (borrow 50% at 3%): return = 3% + 1.5*(9% - 3%) = 12%, risk = 1.5*8% = 12% < 15%.
-->

---

# The Sharpe Ratio

$$\text{Sharpe} = \frac{\mu_p - r_f}{\sigma_p}$$

**Excess return per unit of total risk.**

- X: $(12\% - 3\%)/15\% = 0.60$
- Y: $(9\% - 3\%)/8\% = 0.75$

→ Y is **better per unit of risk.** Levered by 1.5, it earns 12% at **12%** risk, below X's 15%.

→ The portfolio with the **highest Sharpe ratio** is the best risky investment.

---

<!-- _class: structural -->

# Vote: Minimum Risk?

You care **only** about low risk. Assets A (risk 3%) and B (risk 9%), uncorrelated.

Should you put **any** money into the much riskier asset B?

- **A:** No, 100% in A has the lowest risk
- **B:** Yes, a small share of B lowers the risk

**Show of hands.**

<!--
Answer: B. Minimum variance portfolio: w_A = sigma_B^2/(sigma_A^2 + sigma_B^2) = 0.0081/0.0090 = 90%, w_B = 10%. sigma_p = sqrt(0.9^2*0.0009 + 0.1^2*0.0081) = sqrt(0.00081) = 2.85% < 3%.
-->

---

# The Efficient Frontier

**Answer:** B. With **90% A and 10% B**, risk falls to **2.85%**, below both single assets.

$$w_A^{\text{MVP}} = \frac{\sigma_B^2 - \operatorname{Cov}}{\sigma_A^2 + \sigma_B^2 - 2\operatorname{Cov}} = \frac{0.0081}{0.0090} = 90\%$$

- The leftmost point is the **minimum variance portfolio**
- Above it: the **efficient frontier**, the highest return for each level of risk
- Below it: **inefficient** portfolios, for the same risk a better one exists

→ Rational investors choose **only from the frontier.**

*Live demo: widget "Efficient Frontier Explorer".*

---

# The Limits: Is the Lunch Really Free?

- **Estimation error:** Returns, risks and correlations are **estimated** from history. An optimiser exploits errors in these inputs *(Michaud, 1989)*
- **Naive can win:** Splitting equally (**1/N**) often performs as well as optimised weights out of sample *(DeMiguel, Garlappi & Uppal, 2009)*
- **Crises:** Correlations **rise** in falling markets, just when diversification is needed *(Longin & Solnik, 2001)*

→ **Diversification is free of charge, but not free of risk.** It lowers risk you can diversify; it does not protect against the market.

---

# What We Have Seen Today

- **Return averages, risk does not:** The portfolio is calmer than its parts
- **Correlation** is the key: $\rho < 1$ creates the diversification benefit
- **Systematic risk** is the floor, **unsystematic** risk can be diversified away
- **Sharpe ratio:** excess return per unit of risk
- **Efficient frontier:** only portfolios on it are rational choices
- **Limits:** estimation error and crises

**Next session:** CAPM. If only systematic risk is rewarded, how do we **measure** it and **price** it?

---

<!-- _class: center -->

# Take-Away

**Two assets that offset.**

On a slip of paper, name two assets (or two businesses) from a portfolio you know whose **risks offset** each other, and say **why.**

*Hand it in at the exit.*

---

<!-- _class: structural -->

# Appendix
### Going Deeper into Portfolio Theory

---

<!-- _class: small-text -->

# Portfolios of n Assets

$$\sigma_p^2 = \sum_{i=1}^{n} w_i^2 \sigma_i^2 + 2\sum_{i=1}^{n}\sum_{j=i+1}^{n} w_i w_j \operatorname{Cov}(R_i, R_j) = \mathbf{w}^\top \Sigma\, \mathbf{w}$$

- $n$ variance terms and $\tfrac{n(n-1)}{2}$ covariance terms
- With 100 assets: 100 variance terms, **4,950** covariance terms
- **As portfolios grow, the covariances dominate:** the risk of single assets becomes almost irrelevant

$\Sigma$ is the covariance matrix with $\Sigma_{ij} = \operatorname{Cov}(R_i, R_j)$.

---

<!-- _class: tiny-text -->

# Example: Three Assets

| Asset | Expected return | Risk |
|---|---|---|
| A | 14% | 19.5% |
| B | 18% | 21.0% |
| C | 6% | 6.6% |

Correlations: $\rho_{AB} = 0.5$, $\rho_{AC} = 0.15$, $\rho_{BC} = 0.2$. Equal weights $w = 1/3$.

- Return: $\mu_p = (14 + 18 + 6)/3 = \mathbf{12.67\%}$
- Variance terms: $\tfrac{1}{9}(0.0380 + 0.0441 + 0.0044) = 0.00961$
- Covariance terms: $0.00455 + 0.00043 + 0.00062 = 0.00560$
- $\sigma_p^2 = 0.01521 \Rightarrow \sigma_p = \mathbf{12.33\%}$

→ Lower risk than A (19.5%) and B (21.0%), higher return than C (6%).

---

# Constructing the Frontier in Practice

**Minimise** $\sigma_p^2 = \sum_i \sum_j w_i w_j \operatorname{Cov}(R_i, R_j)$

**Subject to:**

- $\sum_i w_i = 1$ (fully invested)
- $\sum_i w_i \mu_i = \mu_{\text{target}}$ (target return)
- $w_i \ge 0$ (optional: no short selling)

Vary $\mu_{\text{target}}$ and the frontier appears. Tools: Excel Solver, Python (`scipy.optimize`, `cvxpy`).

---

# Harry Markowitz (1927--2023)

- *Portfolio Selection* (1952): the foundation of **modern portfolio theory**
- Nobel Memorial Prize in Economic Sciences **1990** (with Merton Miller and William Sharpe)
- Idea: Judge an asset by its **contribution to the portfolio**, not by its risk alone

→ The step from single assets to portfolios is the step to **CAPM** (next session).

---

<!-- _class: end tiny-text -->

# References

- DeMiguel, V., Garlappi, L. & Uppal, R. (2009). Optimal versus naive diversification. *Review of Financial Studies, 22*(5), 1915--1953.
- Longin, F. & Solnik, B. (2001). Extreme correlation of international equity markets. *Journal of Finance, 56*(2), 649--676.
- Markowitz, H. (1952). Portfolio selection. *Journal of Finance, 7*(1), 77--91.
- Michaud, R. O. (1989). The Markowitz optimization enigma: Is "optimized" optimal? *Financial Analysts Journal, 45*(1), 31--42.
- Sharpe, W. F. (1966). Mutual fund performance. *Journal of Business, 39*(1), 119--138.
