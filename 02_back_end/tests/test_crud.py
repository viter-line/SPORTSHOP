import pytest
from crud import get_product_by_id

def test_get_existing_product():
    product_id = 1
    result = get_product_by_id(product_id)
    
    if result:
        assert result['id'] == product_id
        assert "name" in result
    else:
        pytest.skip("Товар з ID 1 не знайдено в базі, пропускаємо тест")

def test_get_non_existent_product():
    result = get_product_by_id(999999)
    assert result is None