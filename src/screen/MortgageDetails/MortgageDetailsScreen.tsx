import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  formatFullCurrency,
  calculateMortgagePayment,
  generateAmortizationTable,
  parseLocaleNumber,
} from '../../engine/calculator';
import font from '../../theme/font';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../compoent/CustomHeader';
import ScreenNameEnum from '../../routes/screenName.enum';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F8FA',
  border: '#EBEBEB',
  divider: '#F2F2F2',
  accent: '#1A6BFF',
  accentLight: '#EBF1FF',
  success: '#00B37D',
  successLight: '#E6FAF4',
  textPrimary: '#0D0D12',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
  rowAlt: '#FAFAFA',
};

const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatPill = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <View style={statPillStyles.wrapper}>
    <Text style={statPillStyles.label}>{label}</Text>
    <Text style={[statPillStyles.value, accent && statPillStyles.accentValue]}>
      {value}
    </Text>
  </View>
);

const statPillStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 13,
    fontFamily: font.PoppinsRegular,
    color: "black",
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 13,
    fontFamily: font.PoppinsSemiBold,
    color: COLORS.textPrimary,
  },
  accentValue: {
    color: COLORS.success,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const MortgageDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { loanAmount, mortgageRate, mortgageYears } = route.params || {};

  const mortgageResults = useMemo(() => {
    const principal = parseLocaleNumber(loanAmount);
    const rate = parseLocaleNumber(mortgageRate);
    const yrs = parseInt(mortgageYears, 10) || 0;

    const payment = calculateMortgagePayment(principal, rate, yrs);
    const table = generateAmortizationTable(principal, rate, yrs);
    const totalPaid = payment * (yrs * 12);
    const totalInterest = totalPaid - principal;

    return {
      monthlyPayment: payment,
      totalInterest,
      totalPaid,
      amortizationTable: table,
    };
  }, [loanAmount, mortgageRate, mortgageYears]);

  const { monthlyPayment, totalInterest, totalPaid, amortizationTable } =
    mortgageResults;

  // ── Header: Summary Card ──────────────────────────────────────────────────

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Monthly Payment Hero */}
      <View style={styles.heroCard}>
        <View style={styles.heroLabelRow}>
          <Text style={styles.heroLabel}>Pago mensual</Text>
        </View>
        <Text style={styles.heroValue}>
          {formatFullCurrency(monthlyPayment)}
        </Text>

        {/* Rate & Term badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{mortgageRate}% TAE</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{mortgageYears} Años</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsCard}>
        <StatPill
          label="Monto del préstamo"
          value={formatFullCurrency(parseLocaleNumber(loanAmount))}
        />
        <View style={styles.statsVerticalDivider} />
        <StatPill
          label="Intereses totales"
          value={formatFullCurrency(totalInterest)}
          accent
        />
        <View style={styles.statsVerticalDivider} />
        <StatPill
          label="Total pagada"
          value={formatFullCurrency(totalPaid)}
        />
      </View>
    </View>
  );

  // ── Table Column Header ───────────────────────────────────────────────────

  const renderTableHeader = () => (
    <View style={styles.tableHeaderRow}>
      <Text style={[styles.tableHeaderCell, styles.colMonth]}>#</Text>
      <Text style={[styles.tableHeaderCell, styles.colPayment]}>Pago</Text>
      <Text style={[styles.tableHeaderCell, styles.colInterest]}>Interés</Text>
      <Text style={[styles.tableHeaderCell, styles.colPrincipal]}>Principal</Text>
      <Text style={[styles.tableHeaderCell, styles.colBalance]}>Balance</Text>
    </View>
  );

  // ── Table Row ─────────────────────────────────────────────────────────────

  const renderRow = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    const isEven = index % 2 === 0;
    const isLastMonth = item.month % 12 === 0;

    return (
      <>
        {/* Year separator */}
        {isLastMonth && (
          <View style={styles.yearSeparator}>
            <View style={styles.yearSeparatorLine} />
            <Text style={styles.yearSeparatorText}>
              Año {item?.month / 12} completo
            </Text>
            <View style={styles.yearSeparatorLine} />
          </View>
        )}

        <View
          style={[
            styles.tableRow,
            isEven ? styles.tableRowEven : styles.tableRowOdd,
          ]}
        >
          <Text style={[styles.tableCell, styles.colMonth, styles.monthCell]}>
            {item.month}
          </Text>
          <Text style={[styles.tableCell, styles.colPayment, {
          }]}>
            {formatFullCurrency(item.payment)}
          </Text>
          <Text style={[styles.tableCell, styles.colInterest, styles.interestCell]}>
            {formatFullCurrency(item.interest)}
          </Text>
          <Text style={[styles.tableCell, styles.colPrincipal, styles.principalCell]}>
            {formatFullCurrency(item.principal)}
          </Text>
          <Text style={[styles.tableCell, styles.colBalance, styles.balanceCell]}>
            {formatFullCurrency(item.remainingBalance)}
          </Text>
        </View>
      </>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <CustomHeader label='Calendario de amortización'


        leftPress={() =>
          navigation.goBack()
        } />
      {/* List */}
      <FlatList
        data={amortizationTable}
        keyExtractor={(item) => item.month.toString()}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
        stickyHeaderIndices={[1]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) =>
          index === 0 ? (
            <>
              {renderTableHeader()}
              {renderRow({ item, index })}
            </>
          ) : (
            renderRow({ item, index })
          )
        }
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const COL = {
  month: 32,
  payment: 72,
  interest: 72,
  principal: 72,
  balance: 80,
};

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    paddingBottom: 32,
  },
  listHeader: {
    paddingBottom: 0,
  },

  // Nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontFamily: font.PoppinsSemiBold,
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  navPlaceholder: {
    width: 36,
  },

  // Header wrapper
  headerWrapper: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12,
  },

  // Hero card
  heroCard: {
    backgroundColor: '#F7F8F8',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  heroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  heroLabel: {
    fontSize: 20,
    fontFamily: font.PoppinsRegular,
    color: "black",
  },
  heroValue: {
    fontSize: 36,
    fontFamily: font.PoppinsBold,
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: "black",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,

  },
  badgeText: {
    fontSize: 15,
    fontFamily: font.PoppinsSemiBold,
    color: "white",
  },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 15
  },
  statsVerticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 12,
  },

  // Table header
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    // marginTop: 10,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontFamily: font.PoppinsSemiBold,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // Table rows
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: COLORS.bg,
  },
  tableRowOdd: {
    backgroundColor: COLORS.rowAlt,
  },
  tableCell: {
    fontSize: 13,
    fontFamily: font.PoppinsRegular,
    color: COLORS.textPrimary,
  },
  monthCell: {
    color: COLORS.textMuted,
    fontFamily: font.PoppinsRegular,
  },
  interestCell: {
    color: COLORS.success,
  },
  principalCell: {
    color: COLORS.accent,
  },
  balanceCell: {
    fontFamily: font.PoppinsSemiBold,
    color: COLORS.textPrimary,
  },

  // Column widths
  colMonth: { width: COL.month },
  colPayment: { width: COL.payment },
  colInterest: { width: COL.interest },
  colPrincipal: { width: COL.principal },
  colBalance: { width: COL.balance },

  // Year separator
  yearSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.bg,
  },
  yearSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  yearSeparatorText: {
    fontSize: 10,
    fontFamily: font.PoppinsSemiBold,
    color: COLORS.textMuted,
    marginHorizontal: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});

export default MortgageDetailsScreen;