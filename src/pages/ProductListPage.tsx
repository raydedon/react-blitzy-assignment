import { memo, useDeferredValue, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useCart, type Product } from "../cart/cartContext";
import { formatPrice } from "../utils/formatPrice";

const ROW_HEIGHT = 52; // 44px row + 8px border-spacing
const SEARCH_DEBOUNCE_MS = 180;
const PAGE_SIZES = [100, 200, 500, 1000, 5000, 10000, 50000, 100000];

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
});

const helper = createColumnHelper<typeof features, Product>();

const columns = helper.columns([
  helper.accessor("productId", { header: "ProductId" }),
  helper.accessor("productName", { header: "Product Name" }),
  helper.accessor("price", {
    header: "Price",
    cell: (info) => formatPrice(info.getValue()),
  }),
  helper.display({
    id: "cart",
    header: "Cart",
    cell: ({ row }) => <CartToggle productId={row.original.productId} />,
  }),
]);

function CartToggle({ productId }: { productId: number }) {
  const { state, addProduct, removeProduct } = useCart();
  const inCart = state.selectedProducts.includes(productId);

  return (
    <button
      type="button"
      className={inCart ? "toggle in-cart" : "toggle"}
      onClick={() =>
        inCart ? removeProduct(productId) : addProduct(productId)
      }
      aria-pressed={inCart}
      aria-label={inCart ? "Remove from cart" : "Add to cart"}
      title={inCart ? "Remove from cart" : "Add to cart"}
    >
      {inCart ? "−" : "+"}
    </button>
  );
}

function ProductListPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search]);

  return (
    <section className="page">
      <h1>Products</h1>
      <input
        type="search"
        className="search"
        placeholder="Search ..."
        aria-label="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ProductTable search={debouncedSearch} />
    </section>
  );
}

// Memoized so keystrokes (which only re-render the parent's input) don't
// re-run the 50k-row filter/pagination; it re-renders only when the deferred
// search text changes.
const ProductTable = memo(function ProductTable({
  search,
}: {
  search: string;
}) {
  const { state } = useCart();

  const table = useTable({
    features,
    columns,
    data: state.listOfProducts,
    state: { globalFilter: search },
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) => column.id !== "cart",
    initialState: { pagination: { pageIndex: 0, pageSize: PAGE_SIZES[0] } },
  });

  const { pageIndex, pageSize } = table.state.pagination;
  const rows = table.getRowModel().rows;

  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });
  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <>
      <div className="table-scroll" ref={scrollRef}>
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className={`col-${header.column.id}`}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length > 0 ? (
              <>
                {paddingTop > 0 && (
                  <tr aria-hidden="true" style={{ height: paddingTop }} />
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  return (
                    <tr key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <td key={cell.id} className={`col-${cell.column.id}`}>
                          <table.FlexRender cell={cell} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr aria-hidden="true" style={{ height: paddingBottom }} />
                )}
              </>
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty">
                  No products match “{search}”
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button
          type="button"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          «
        </button>
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          ‹
        </button>
        <span>
          Page {table.getPageCount() === 0 ? 0 : pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          »
        </button>
        <label>
          Show{" "}
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
});

export default ProductListPage;
