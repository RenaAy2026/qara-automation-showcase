# Bug Reports

Defects found while exploring [Sauce Demo](https://www.saucedemo.com), a practice e-commerce site that includes deliberately faulty test users. Both defects below were reproduced more than once, and each was compared against `standard_user` as a control.

**Environment:** Chrome on macOS, tested October 26, 2026.

---

## BUG-001: All products show the same dog image for problem_user

| Field | Detail |
| --- | --- |
| Severity | Major |
| Priority | High |
| Area | Product listing (inventory page) |
| User | `problem_user` |
| Status | Reproduced consistently |

**Steps to reproduce**
1. Open https://www.saucedemo.com
2. Log in with username `problem_user` and password `secret_sauce`.
3. Look at the product images on the inventory page.

**Expected result**
Each product shows its own image (backpack, bike light, T-shirt, and so on).

**Actual result**
Every product shows the same photo of a dog. The wrong images stay after reloading the page.

**Control check**
With `standard_user`, each product shows its correct image.

**Impact**
Shoppers cannot tell products apart visually, which hurts trust and purchase decisions on a product listing page.

**Evidence**
Screenshot of the inventory page after login as `problem_user`.


---

## BUG-002: Sort dropdown reverts to "Name (A to Z)" and does not reorder products for problem_user

| Field | Detail |
| --- | --- |
| Severity | Major |
| Priority | Medium |
| Area | Product listing (sort control) |
| User | `problem_user` |
| Status | Reproduced consistently |

**Steps to reproduce**
1. Open https://www.saucedemo.com
2. Log in with username `problem_user` and password `secret_sauce`.
3. Click the sort dropdown at the top right of the product list.
4. Select **Name (Z to A)**.

**Expected result**
The dropdown shows "Name (Z to A)" and the products are reordered, with "Test.allTheThings() T-Shirt (Red)" first.

**Actual result**
The dropdown closes and shows "Name (A to Z)" again. The product order does not change.

**Control check**
With `standard_user`, all four sort options (name A to Z, name Z to A, price low to high, price high to low) apply correctly and reorder the products.

**Impact**
Shoppers cannot sort the catalog, which makes it harder to find products by name or price.

**Evidence**
Screen recording showing the dropdown open with Z to A highlighted, then closing back to A to Z with the product order unchanged.

**Note**
Only the Z to A option was tested for this user. The price sort options were not tested with `problem_user`.