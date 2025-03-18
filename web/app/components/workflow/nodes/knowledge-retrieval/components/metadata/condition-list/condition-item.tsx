import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import {
  RiDeleteBinLine,
} from '@remixicon/react'
import MetadataIcon from '../metadata-icon'
import {
  COMMON_VARIABLE_REGEX,
  VARIABLE_REGEX,
  comparisonOperatorNotRequireValue,
} from './utils'
import ConditionOperator from './condition-operator'
import ConditionString from './condition-string'
import ConditionNumber from './condition-number'
import ConditionDate from './condition-date'
import type {
  ComparisonOperator,
  HandleRemoveCondition,
  HandleUpdateCondition,
  MetadataFilteringCondition,
  MetadataShape,
} from '@/app/components/workflow/nodes/knowledge-retrieval/types'
import { MetadataFilteringVariableType } from '@/app/components/workflow/nodes/knowledge-retrieval/types'
import cn from '@/utils/classnames'

type ConditionItemProps = {
  className?: string
  disabled?: boolean
  condition: MetadataFilteringCondition // condition may the condition of case or condition of sub variable
  onRemoveCondition?: HandleRemoveCondition
  onUpdateCondition?: HandleUpdateCondition
} & Pick<MetadataShape, 'metadataList' | 'availableStringVars' | 'availableStringNodesWithParent' | 'availableNumberVars' | 'availableNumberNodesWithParent' | 'isCommonVariable' | 'availableCommonStringVars' | 'availableCommonNumberVars'>
const ConditionItem = ({
  className,
  disabled,
  condition,
  onRemoveCondition,
  onUpdateCondition,
  metadataList = [],
  availableStringVars = [],
  availableStringNodesWithParent = [],
  availableNumberVars = [],
  availableNumberNodesWithParent = [],
  isCommonVariable,
  availableCommonStringVars = [],
  availableCommonNumberVars = [],
}: ConditionItemProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const canChooseOperator = useMemo(() => {
    if (disabled)
      return false

    return true
  }, [disabled])

  const doRemoveCondition = useCallback(() => {
    onRemoveCondition?.(condition.id)
  }, [onRemoveCondition, condition.id])

  const currentMetadata = useMemo(() => {
    return metadataList.find(metadata => metadata.name === condition.name)
  }, [metadataList, condition.name])

  const handleConditionOperatorChange = useCallback((operator: ComparisonOperator) => {
    onUpdateCondition?.(
      condition.id,
      {
        ...condition,
        value: comparisonOperatorNotRequireValue(condition.comparison_operator) ? undefined : condition.value,
        comparison_operator: operator,
      })
  }, [onUpdateCondition, condition])

  const valueAndValueMethod = useMemo(() => {
    if (
      (currentMetadata?.type === MetadataFilteringVariableType.string || currentMetadata?.type === MetadataFilteringVariableType.number)
      && typeof condition.value === 'string'
    ) {
      const regex = isCommonVariable ? COMMON_VARIABLE_REGEX : VARIABLE_REGEX
      const matchedStartNumber = isCommonVariable ? 2 : 3
      const matched = condition.value.match(regex)

      if (matched?.length) {
        return {
          value: matched[0].slice(matchedStartNumber, -matchedStartNumber),
          valueMethod: 'variable',
        }
      }
      else {
        return {
          value: condition.value,
          valueMethod: 'constant',
        }
      }
    }

    return {
      value: condition.value,
      valueMethod: 'constant',
    }
  }, [currentMetadata, condition.value, isCommonVariable])
  const [localValueMethod, setLocalValueMethod] = useState(valueAndValueMethod.valueMethod)

  const handleValueMethodChange = useCallback((v: string) => {
    setLocalValueMethod(v)
    onUpdateCondition?.(condition.id, { ...condition, value: undefined })
  }, [condition, onUpdateCondition])

  const handleValueChange = useCallback((v: any) => {
    onUpdateCondition?.(condition.id, { ...condition, value: v })
  }, [condition, onUpdateCondition])

  return (
    <div className={cn('flex mb-1 last-of-type:mb-0', className)}>
      <div className={cn(
        'grow bg-components-input-bg-normal rounded-lg',
        isHovered && 'bg-state-destructive-hover',
      )}>
        <div className='flex items-center p-1'>
          <div className='grow w-0'>
            <div className='inline-flex items-center pl-1 pr-1.5 h-6 border-[0.5px] border-components-panel-border-subtle bg-components-badge-white-to-dark rounded-md shadow-xs'>
              <div className='mr-0.5 p-[1px]'>
                <MetadataIcon type={currentMetadata?.type} className='w-3 h-3' />
              </div>
              <div className='mr-0.5 system-xs-medium text-text-secondary'>{currentMetadata?.name}</div>
              <div className='system-xs-regular text-text-tertiary'>{currentMetadata?.type}</div>
            </div>
          </div>
          <div className='mx-1 w-[1px] h-3 bg-divider-regular'></div>
          <ConditionOperator
            disabled={!canChooseOperator}
            variableType={currentMetadata?.type || MetadataFilteringVariableType.string}
            value={condition.comparison_operator}
            onSelect={handleConditionOperatorChange}
          />
        </div>
        <div className='border-t border-t-divider-subtle'>
          {
            !comparisonOperatorNotRequireValue(condition.comparison_operator) && currentMetadata?.type === MetadataFilteringVariableType.string && (
              <ConditionString
                valueMethod={localValueMethod}
                onValueMethodChange={handleValueMethodChange}
                nodesOutputVars={availableStringVars}
                availableNodes={availableStringNodesWithParent}
                value={valueAndValueMethod.value as string}
                onChange={handleValueChange}
                isCommonVariable={isCommonVariable}
                commonVariables={availableCommonStringVars}
              />
            )
          }
          {
            !comparisonOperatorNotRequireValue(condition.comparison_operator) && currentMetadata?.type === MetadataFilteringVariableType.number && (
              <ConditionNumber
                valueMethod={localValueMethod}
                onValueMethodChange={handleValueMethodChange}
                nodesOutputVars={availableNumberVars}
                availableNodes={availableNumberNodesWithParent}
                value={valueAndValueMethod.value}
                onChange={handleValueChange}
                isCommonVariable={isCommonVariable}
                commonVariables={availableCommonNumberVars}
              />
            )
          }
          {
            !comparisonOperatorNotRequireValue(condition.comparison_operator) && currentMetadata?.type === MetadataFilteringVariableType.time && (
              <ConditionDate
                value={condition.value as number}
                onChange={handleValueChange}
              />
            )
          }
        </div>
      </div>
      <div
        className='shrink-0 flex items-center justify-center ml-1 mt-1 w-6 h-6 rounded-lg cursor-pointer hover:bg-state-destructive-hover text-text-tertiary hover:text-text-destructive'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={doRemoveCondition}
      >
        <RiDeleteBinLine className='w-4 h-4' />
      </div>
    </div>
  )
}

export default ConditionItem
