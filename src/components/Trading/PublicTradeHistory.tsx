import { Alert, CircularProgress, Snackbar } from '@mui/material'
import { ColDef, GridReadyEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import 'ag-grid-enterprise'
import { AgGridReact } from 'ag-grid-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import '../../css/charts.css'
import { type Order, type tradingDataDef } from '../DataManagement'
import { type FilterState } from '../StateManagement'

export function PublicTradeHistory(data: { tradingData: tradingDataDef }) {
  const gridRef = useRef<AgGridReact<Order[]>>(null)
  const filterState = useSelector(
    (state: { filters: FilterState }) => state.filters,
  )
  const [pair] = useMemo(
    () => [filterState.pair, filterState.exchange],
    [filterState.pair, filterState.exchange],
  )
  const [snackIsOpen, setSnackIsOpen] = useState<boolean>(false)

  const [columnDefs] = useState<ColDef[]>([
    { field: 'amount' },
    { field: 'price' },
    { field: 'amount' },
  ])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
      enableCellChangeFlash: true,
      valueSetter: (params: any) => {
        return params.newValue
      },
    }
  }, [])

  const onGridReady = useCallback((event: GridReadyEvent) => {}, [])

  return (
    <div style={{ marginTop: 10, height: '100%' }}>
      Public Trades History
      {data.tradingData.orders.length === 0 ? (
        <CircularProgress style={{ marginLeft: '50%', marginTop: '10%' }} />
      ) : (
        <div
          className={'ag-theme-quartz-dark'}
          style={{
            width: '100%',
            height: '600px',
            overflow: 'visible !important',
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={data.tradingData.orders}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            suppressCopyRowsToClipboard={true}
          />
        </div>
      )}
      <Snackbar
        open={snackIsOpen}
        autoHideDuration={2000}
        onClose={() => {
          setSnackIsOpen(false)
        }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Order cancelled!
        </Alert>
      </Snackbar>
    </div>
  )
}
